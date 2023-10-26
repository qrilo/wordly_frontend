import { Loader } from '../loader';
import styles from './page-loader.module.scss';

export const PageLoader = () => {

    return (
        <div className={styles.container}>
            <Loader />
        </div>
    );
}