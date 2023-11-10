import styles from './learn-term-card.module.scss';

const LearnTermCard = ({ term }) => {
    return (
        <div className={styles.term}>
            <div className={styles.left}>
                <div className={styles.top}>{term.term}</div>
                <div className={styles.bottom}>{term.definition}</div>
            </div>
            {term.imageUrl && <img height={64} width={64} src={term.imageUrl} />}
        </div>
    );
}

export default LearnTermCard;