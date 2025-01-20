import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-lg-3 col-md-4 col-sm-12 sidebar-layout">
          <Sidebar />
        </div>

        <div className="offset-xl-3 offset-lg2-3 col-lg-9 col-md-8 col-sm-12 flex-column">
          <main className="flex-grow-1">
            {children}
          </main>
        </div>
      </div>     
    </div>
  );
}
