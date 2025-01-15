import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="d-none d-lg-block col-lg-3 sidebar-layout">
          <Sidebar />
        </div>

        <div className="col-12 offset-lg-3 col-lg-9 flex-column">
          <main className="flex-grow-1">
            {children}
          </main>
        </div>
      </div>     
    </div>
  );
}
