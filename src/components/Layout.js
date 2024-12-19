import Sidebar from './Sidebar';

export default function Layout({ children }) {
    return  (
        <div className='row flex-column'>
            <Sidebar />
            <main className='col-xxl-9 col-xl-8 align-self-end'>
                {children}
            </main>
        </div>
    )
}