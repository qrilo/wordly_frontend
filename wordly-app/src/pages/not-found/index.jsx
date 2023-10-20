import { Panel } from "primereact/panel";
import Header from "../../components/header";

const NotFoundPage = () => {
    return (
        <div className="h-screen">
            <Header />
            <div className="flex justify-content-center mt-8">
                <Panel header="404 - Page Not Found" className="not-found-panel">
                    <p>Sorry, the page you are looking for does not exist.</p>
                </Panel>
            </div>
        </div>
    );
}

export default NotFoundPage;