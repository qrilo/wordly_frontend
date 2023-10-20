import { useNavigate } from 'react-router-dom';
import styles from './collection-card.module.scss';

const CollectionCard = ({ collection }) => {
    const navigate = useNavigate();
    return (
        <div className={styles.card} onClick={() => navigate(`/collections/${collection.id}`)}>
            <div className={styles.inner}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h4>{collection.name}</h4>
                    </div>
                    {collection.imageUrl && <img height={64} width={64} src={collection.imageUrl} />}
                </div>
                <div className={styles.bottom}>
                    <span>{new Date(collection.createdAtUtc).toDateString()}</span>
                </div>
            </div>

        </div>
    );
}

export default CollectionCard;