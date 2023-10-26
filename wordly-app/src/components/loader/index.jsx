import styles from './loader.module.scss';

export const Loader = ({ width = 45, height = 45 }) => {
    return (
        <div className={styles.loader} style={{ width: width, height: height }}></div>
    );
}