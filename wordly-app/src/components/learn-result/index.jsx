import { useEffect } from 'react';
import styles from './learn-result.module.scss';
import { Knob } from 'primereact/knob';
import LearnTermCard from '../learn-term-card';

const LearnResult = ({ percent = '', knownTotal, unknownTotal, onClick, unknownTerms }) => {
    console.log(unknownTerms);
    useEffect(() => { }, [])

    return (
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
                                    value={Math.floor(percent * 100) / 100} />
                            </div>
                            <div className={styles.result__stat}>
                                <div className={styles.result__learned__box}>
                                    <div>Known</div>
                                    <div>{knownTotal}</div>
                                </div>
                                <div className={styles.result__need__learned__box}>
                                    <div>Unknown</div>
                                    <div>{unknownTotal}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.result__block}>
                        <h2>Choose your next action</h2>
                        <div className={styles.result__info}>
                            <div className={styles.button__action} onClick={onClick}>
                                <i className='pi pi-replay' style={{ color: '#59E8B5', fontSize: '32px' }}></i>
                                <div className='flex-1 ml-2' >Repeat again</div>
                                <i className='pi pi-angle-right' ></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {unknownTotal > 0 &&
                < div >
                    <h2 style={{ color: '#586384' }}>Unknown</h2>
                </div>
            }
            <div className='flex flex-column gap-2 my-4'>
                {unknownTerms.map((item, key) => {
                    return <LearnTermCard term={item} key={key} />
                })}
            </div>
        </div>
    );
}

export default LearnResult;