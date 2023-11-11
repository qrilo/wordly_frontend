import { useNavigate, useParams } from 'react-router-dom';
import styles from './flashcard.module.scss';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import collectionService from '../../services/collectionService';
import { PageLoader } from '../../components/page-loader';
import { Knob } from 'primereact/knob';
import LearnTermCard from '../../components/learn-term-card';
import LearnContainer from '../../components/learn-conrainer';
import LearnResult from '../../components/learn-result';

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

    const speak = (event) => {
        event.stopPropagation();
        const message = new SpeechSynthesisUtterance()
        message.text = currentTerm.term;
        window.speechSynthesis.speak(message)
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
            <LearnContainer>
                {showResult ?
                    <LearnResult
                        percent={countPercent()}
                        unknownTerms={cancel}
                        unknownTotal={cancel.length}
                        knownTotal={success.length}
                        onClick={reload} />
                    :
                    <div>
                        <div>
                            <div className={styles.card__container} onClick={handleCardClick}>
                                <div key={currentTerm.id} className={`${styles.card} ${isFlipped && styles.card__flip}`}>
                                    <div className={styles.card__front}>
                                        <div className={styles.card__front__content}>
                                            <div className={styles.card__front_speaker}>
                                                <Button
                                                    icon='pi pi-volume-up'
                                                    link
                                                    onClick={event => speak(event)} />
                                            </div>
                                            <div className={styles.front__term}>
                                                {currentTerm.term}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.card__back}>
                                        <div className={styles.card__back_definition}>
                                            <div className={styles.card__speaker}></div>
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
                                    size="large"
                                    onClick={handleCancel}
                                    style={{ backgroundColor: 'white' }}
                                    icon="pi pi-times"
                                    rounded
                                    text
                                    raised
                                    severity="danger"
                                    aria-label="Cancel" />
                                <Button
                                    size="large"
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
            </LearnContainer>
        </div>
    );
}

export default FlashcardPage;


