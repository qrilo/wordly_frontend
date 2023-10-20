import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import styles from './termin-card.module.scss';
import { useEffect, useState } from 'react';

const TermCard = ({ term, setSelectedTerms, selectedTerms }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(selectedTerms.some(selectedTerm => selectedTerm.id === term.id));
    }, [term, selectedTerms]);

    return (
        <div className={styles.card}>
            <div>
                <Checkbox onChange={e => {
                    setChecked(e.checked)
                    if (e.checked) {
                        setSelectedTerms(prev => [...prev, term]);
                    } else {
                        setSelectedTerms(prev => prev.filter(item => item.id !== term.id))
                    }

                }} checked={checked}></Checkbox>
            </div>
            <div className={styles.content}>
                <div>
                    <span>{term.term}</span>
                </div>
                <div className={styles.definition}>
                    <span>{term.definition}</span>
                </div>
                <div>
                    {term.imageUrl && <img height={64} width={64} src={term.imageUrl} />}
                </div>
                <div>
                    <Button
                        icon="pi pi-volume-up"
                        text
                        onClick={() => {
                            const message = new SpeechSynthesisUtterance()
                            message.text = term.term
                            window.speechSynthesis.speak(message)
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default TermCard;