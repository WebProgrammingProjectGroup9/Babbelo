import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";

const ForceGraph2D = dynamic(() => import("react-force-graph").then((mod) => mod.ForceGraph2D), { ssr: false });

const IMAGE_SIZE = 10;
const BORDER_SIZE = 1;
const GROUP_COLORS = {
  1: "blue",
  2: "yellow",
  3: "orange",
  4: "red",
};

export default function Vriendenweb() {
  const [graphData, setGraphData] = useState(null);
  const [imageMap, setImageMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const preloadImages = async (nodes) => {
    const images = new Map();
    await Promise.all(
      nodes.map((node) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            images.set(node.id, img);
            resolve();
          };
          img.src = node.img || `https://eu.ui-avatars.com/api/?name=${node.id}&size=250`;
        })
      )
    );
    return images;
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      const accountId = localStorage.getItem("account_id");
      const token = localStorage.getItem("token");

      if (!accountId || !token) {
        setError("Account ID or token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const nodes = new Map();
        const links = [];

        const addNode = (id, data, group) => {
          if (!nodes.has(id)) {
            nodes.set(id, { ...data, group });
          }
        };

        const addLink = (source, target) => {
          links.push({ source, target });
        };

        // Fetch the logged-in user's data
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/${accountId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch logged-in user data");
        }

        const loggedInUser = await userResponse.json();
        addNode(accountId, {
          id: accountId,
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          img: loggedInUser.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${loggedInUser.firstName}+${loggedInUser.lastName}&size=250`,
        }, 1);

        // Fetch friends of the logged-in user
        const friendsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/friend/${accountId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!friendsResponse.ok) {
          throw new Error("Failed to fetch friends");
        }

        const friendIds = await friendsResponse.json();
        for (const friendId of friendIds) {
          const friendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/${friendId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!friendResponse.ok) continue;

          const friendData = await friendResponse.json();
          addNode(friendId, {
            id: friendId,
            firstName: friendData.firstName,
            lastName: friendData.lastName,
            img: friendData.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${friendData.firstName}+${friendData.lastName}&size=250`,
          }, 2);

          addLink(accountId, friendId);
        }

        // Fetch friends of friends
        const fofResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/neo4j/friendsOfFriends/${accountId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!fofResponse.ok) {
          throw new Error("Failed to fetch friends of friends");
        }

        const fofIds = await fofResponse.json();

        for (const fofId of fofIds) {
          if (nodes.has(fofId)) continue; // Skip duplicates

          const fofResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/${fofId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!fofResponse.ok) continue;

          const fofData = await fofResponse.json();
          addNode(fofId, {
            id: fofId,
            firstName: fofData.firstName,
            lastName: fofData.lastName,
            img: fofData.profileImgUrl || `https://eu.ui-avatars.com/api/?name=${fofData.firstName}+${fofData.lastName}&size=250`,
          }, 3);

          // Link fofId to each friend in friendIds
          for (const friendId of friendIds) {
            addLink(friendId, fofId);
          }
        }

        const nodeArray = Array.from(nodes.values());
        const imageMap = await preloadImages(nodeArray);

        setImageMap(imageMap);
        setGraphData({
          nodes: nodeArray,
          links,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching graph data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <div className="graph-wrapper container-fluid d-flex justify-content-center align-items-center vh-100">
      <ForceGraph2D
      graphData={graphData}
      linkWidth={3}
      minZoom={5}
      nodeCanvasObject={(node, ctx) => {
        const img = imageMap.get(node.id);
        const groupColor = GROUP_COLORS[node.group] || "gray";

        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, (IMAGE_SIZE + BORDER_SIZE) / 2, 0, 2 * Math.PI);
        ctx.fillStyle = groupColor;
        ctx.fill();
        ctx.restore();

        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(node.x, node.y, IMAGE_SIZE / 2, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, node.x - IMAGE_SIZE / 2, node.y - IMAGE_SIZE / 2, IMAGE_SIZE, IMAGE_SIZE);
          ctx.restore();
        }

        ctx.font = "5px Sans-Serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(node.firstName, node.x, node.y + IMAGE_SIZE / 2 + 5);
      }}
      onNodeClick={(node) => {
        router.push(`/account/${node.id}`);
      }}
    />
    </div>
  );
}
