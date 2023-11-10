import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import collectionService from "../../services/collectionService";
import styles from './learn.module.scss';
import { useCounter } from 'primereact/hooks';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import LearnResult from "../../components/learn-result";
import LearnContainer from "../../components/learn-conrainer";
import { PageLoader } from "../../components/page-loader";

const LearnPage = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [test, setTest] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const { count, increment, decrement, reset } = useCounter(1);
    const [answers, setAnswers] = useState([]);
    const inputRef = useRef();
    const [showResult, setShowResult] = useState(false);
    const [testResult, setTestResult] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTest();
    }, [])

    const fetchTest = async () => {
        const response = await collectionService.getTest(id, state);
        if (response.isSuccessed) {
            setTest(response.data);
            setCurrentQuestion(response.data[0]);
            setLoading(prev => !prev);
        }

        if (response.isNotFound) {
            navigate('/collections')
        }
    }

    const submitSingleWritten = async (answer) => {
        setLoading(prev => !prev);

        const model = {
            answers: answers
        };

        model.answers.push(answer);

        const response = await collectionService.submitTest(id, model);
        if (response.isSuccessed) {
            setShowResult(prev => !prev);
            setTestResult(response.data);
        }

        setLoading(prev => !prev);
    }

    const handleSingleAnswer = async (answer) => {
        const model = {
            id: currentQuestion.single.id,
            answer: answer
        }
        setAnswers(prev => [...prev, model]);

        increment();
        setCurrentQuestion(test[count]);

        if (count == test.length) {
            await submitSingleWritten(model);
            return;
        }
    }

    const handleWrittenAnswer = async () => {
        const model = {
            id: currentQuestion.written.id,
            answer: inputRef.current.value
        }
        setAnswers(prev => [...prev, model])

        increment();
        setCurrentQuestion(test[count]);

        if (count == test.length) {
            await submitSingleWritten(model);
            return;
        }
    }

    const SingleCard = () => {
        return (
            <div className={styles.content}>
                <div className={styles.question__container}>
                    <div>
                        <div className={styles.top}>
                            <p>Definition</p>
                            <p>{count} of {test.length}</p>
                        </div>
                        <div className={styles.center}>
                            <div>
                                {currentQuestion && currentQuestion.single.question}
                            </div>
                        </div>
                    </div>
                    <div className={styles.answers}>
                        {currentQuestion && currentQuestion.single.answers.map((answer, index) => {
                            return <button key={index} className={styles.button} onClick={() => handleSingleAnswer(answer)}>{answer}</button>
                        })}
                    </div>
                </div>
            </div>

        );
    }

    const WrittenCard = () => {
        return (
            <div className={styles.content}>
                <div className={styles.question__container}>
                    <div>
                        <div className={styles.top}>
                            <p>Definition</p>
                            <p>{count} of {test.length}</p>
                        </div>
                        <div className={styles.center}>
                            <div>
                                {currentQuestion && currentQuestion.written.question}
                            </div>
                        </div>
                    </div>
                    <div className={styles.written}>
                        <div className="mb-2" style={{ fontWeight: 500, color: '#7C7C7C' }}>
                            Your answer
                        </div>
                        <InputText ref={inputRef} />
                        <div className="mt-4 flex justify-content-end">
                            <Button label={count == test.length ? 'Finish' : 'Next'} onClick={handleWrittenAnswer} />
                        </div>
                    </div>
                </div>
            </div>

        )
    }


    const MatchCard = () => {
        const [terms, setTerms] = useState([]);
        const [matchAnswers, setMatchAnswers] = useState([]);

        useEffect(() => {
            setTerms(currentQuestion.match.terms);
            setMatchAnswers(currentQuestion.match.definitions.map(definition => {
                return {
                    id: definition.id,
                    term: null,
                    answered: false,
                    definition: definition.definition
                }
            }));

        }, [])

        const handleDragEnd = (event) => {
            const draggableData = event.active.data.current;

            if (event.over === null) {
                if (terms.find(item => item == draggableData)) { // if clicked on term in terms box
                    return;
                }
                setTerms(prev => [...prev, draggableData])
                setMatchAnswers(prev => prev.map(item => {
                    if (draggableData == item.term) {
                        item.answered = false;
                        item.term = null;
                    }
                    return item;
                }));

                return;
            }

            let edit = false;
            const answer = matchAnswers.find(answer => answer.term == draggableData);
            if (answer) {
                setMatchAnswers(prev => prev.map(answer => {
                    if (event.over.data.current.definition == answer.definition) {
                        if (answer.answered) {
                            setTerms(prev => [...prev, answer.term])
                            edit = true;
                        }
                    }
                    if (draggableData == answer.term) {
                        answer.term = null;
                        answer.answered = false;
                        return answer;
                    }
                    return answer;
                }))
            }

            setMatchAnswers(prev => prev.map(answer => {
                if (event.over.data.current.definition == answer.definition) {
                    if (answer.term && !edit) {
                        setTerms(prev => [...prev, answer.term])
                    }
                    answer.term = draggableData;
                    answer.answered = true;
                    return answer;
                }
                return answer;
            }))

            setTerms(prev => prev.filter(term => term != draggableData))
        }

        const handleMatchAnswer = async () => {
            setLoading(prev => !prev);
            increment();
            setCurrentQuestion(test[count]);

            const model = {
                answers: answers
            };
            model.answers.push(...matchAnswers.map(answer => ({
                id: answer.id,
                answer: answer.term
            })));

            const response = await collectionService.submitTest(id, model);
            if (response.isSuccessed) {
                setShowResult(prev => !prev);
                setTestResult(response.data);
            }

            setLoading(prev => !prev);
        }

        return (
            <div className={styles.content}>
                <div className={styles.match__question__container}>
                    <div>
                        <div className={styles.top}>
                            <p>Terms</p>
                        </div>
                        <div >
                            <DndContext onDragEnd={event => handleDragEnd(event)}>
                                <div className={styles.draggble__container}>
                                    {terms.map((item, index) => {
                                        return <Draggable id={index + 1} key={index} data={item}>{item}</Draggable>
                                    })}
                                </div>
                                {matchAnswers.map((item, index) => {
                                    return <Droppable id={index + 1} key={index} data={item} >
                                        <div>
                                            {item.term && <Draggable id={item.id} key={index} data={item.term}>{item.term}</Draggable>}
                                        </div>
                                        <div>{item.definition}</div>
                                    </Droppable>
                                })}

                            </DndContext>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-content-end">
                            <Button label="Finish" onClick={handleMatchAnswer} />
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    return (
        <div>
            {loading && <PageLoader />}
            <div className={styles.header}>
                <h2>Learn</h2>
                <Button icon='pi pi-times' onClick={() => navigate(`/collections/${id}`)} />
            </div>
            {
                currentQuestion && currentQuestion.questionType === 'single' &&
                <SingleCard />
            }

            {
                currentQuestion && currentQuestion.questionType === 'written' &&
                <WrittenCard />
            }

            {
                currentQuestion && currentQuestion.questionType === 'match' &&
                <MatchCard />
            }
            {
                (showResult && testResult) &&
                <LearnContainer>
                    <LearnResult
                        onClick={() => window.location.reload()}
                        unknownTerms={testResult.wrongAnswerTerms}
                        knownTotal={testResult.totalKnown}
                        unknownTotal={testResult.totalUnknown}
                        percent={testResult.correctAnswersPercent} />
                </LearnContainer>

            }
        </div >
    );
}


function Draggable(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
        data: props.data
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <button className={styles.match__button} ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
}

function Droppable(props) {
    const { setNodeRef, isOver } = useDroppable({
        id: props.id,
        data: props.data
    });

    const style = {
        opacity: isOver ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className={styles.droppable} >
            {props.children}
        </div>
    );
}

export default LearnPage;