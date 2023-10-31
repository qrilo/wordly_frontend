import { useNavigate, useParams } from 'react-router-dom';
import styles from './flashcard.module.scss';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import collectionService from '../../services/collectionService';
import { PageLoader } from '../../components/page-loader';
import { Knob } from 'primereact/knob';

const FlashcardPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    const [collection, setCollection] = useState();

    const [currentTerm, setCurrentTerm] = useState();
    const [count, setCount] = useState(1);
    const [showResult, setShowResult] = useState(false);

    const [success, setSuccess] = useState([]);
    const [cancel, setCancel] = useState([]);

    useEffect(() => {
        fetchCollection();
    }, [])

    const fetchCollection = async () => {
        const response = await collectionService.getCollection(id);
        if (response.isSuccessed) {
            setCollection(response.data);
            setCurrentTerm(response.data.terms[0]);
            setLoading(false);
        }

        if (response.isNotFound) {
            navigate('/collections');
        }
    }

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    }

    const handleSuccess = () => {
        setIsFlipped(false);


        if (collection.terms.length == count) {
            setSuccess(prev => [...prev, currentTerm]);
            setShowResult(true);
            return;
        }

        setCount(prev => prev + 1);
        setSuccess(prev => [...prev, currentTerm]);
        setCurrentTerm(collection.terms[count]);
    }

    const handleCancel = () => {
        setIsFlipped(false);

        if (collection.terms.length == count) {
            setCancel(prev => [...prev, currentTerm]);
            setShowResult(true);
            return;
        }

        setCount(prev => prev + 1);
        setCancel(prev => [...prev, currentTerm]);
        setCurrentTerm(collection.terms[count]);
    }

    if (loading) {
        return <PageLoader />
    }

    const countPercent = () => {
        const precent = Math.round((success.length / collection.terms.length) * 100);

        return precent;
    }

    const reload = () => {
        setCount(1);
        setCurrentTerm(collection.terms[0]);
        setShowResult(false);
        setCancel([]);
        setSuccess([]);
    }

    return (
        <div>
            <div>
                <div className={styles.header}>
                    <div className={styles.header__sides}>

                    </div>
                    <div className={styles.center}>
                        <h3 className='flex'>{count}/ {collection.terms.length}</h3>
                        <h3>{collection.name}</h3>
                    </div>
                    <div className={styles.header__sides}>
                        <Button
                            icon="pi pi-times"
                            onClick={() => navigate('/collections')} />
                    </div>
                </div>
            </div>
            <div className={styles.content}>

                {showResult ?
                    <div>
                        <h1>Congratulations! You repeated all the cards.</h1>
                        <div className={styles.result}>
                            <div className={styles.left}>
                                <div className={styles.result__block}>
                                    <h2>Your result</h2>
                                    <div className={styles.result__info}>
                                        <div>
                                            <Knob
                                                size={100}
                                                value={countPercent()} />
                                        </div>
                                        <div className={styles.result__stat}>
                                            <div className={styles.result__learned__box}>
                                                <div>Known</div>
                                                <div>{success.length}</div>
                                            </div>
                                            <div className={styles.result__need__learned__box}>
                                                <div>Unknown</div>
                                                <div>{cancel.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <div className={styles.result__block}>
                                    <h2>Choose your next action</h2>
                                    <div className={styles.result__info}>
                                        <div className={styles.button__action} onClick={reload}>
                                            <i className='pi pi-replay' style={{ color: '#59E8B5', fontSize: '32px' }}></i>
                                            <div className='flex-1 ml-2' >Repeat again</div>
                                            <i className='pi pi-angle-right' ></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {cancel.length > 0 &&
                            < div >
                                <h2 style={{ color: '#586384' }}>Unknown</h2>
                            </div>
                        }
                        <div className='flex flex-column gap-2 my-4'>
                            {cancel.map((item, key) => {
                                return <Card term={item} key={key} />
                            })}
                        </div>
                    </div>
                    :
                    <div>
                        <div>
                            <div className={styles.card__container} onClick={handleCardClick}>
                                <div key={currentTerm.id} className={`${styles.card} ${isFlipped && styles.card__flip}`}>
                                    <div className={styles.card__front}>
                                        {currentTerm.term}
                                    </div>
                                    <div className={styles.card__back}>
                                        <div className={styles.card__back_definition}>
                                            <div >
                                                {currentTerm.definition}
                                            </div>
                                        </div>
                                        {currentTerm.imageUrl && <img src={currentTerm.imageUrl} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <div className={styles.buttons}>
                                <Button
                                    onClick={handleCancel}
                                    style={{ backgroundColor: 'white' }}
                                    icon="pi pi-times"
                                    rounded
                                    text
                                    raised
                                    severity="danger"
                                    aria-label="Cancel" />
                                <Button
                                    onClick={handleSuccess}
                                    style={{ backgroundColor: 'white' }}
                                    icon="pi pi-check"
                                    rounded
                                    text
                                    raised
                                    severity="success"
                                    aria-label="Search" />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div >
    );
}

const Card = ({ term }) => {
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

export default FlashcardPage;


