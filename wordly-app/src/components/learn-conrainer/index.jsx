import styles from './learn-container.module.scss';

const LearnContainer = ({ children }) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
}

export default LearnContainer;