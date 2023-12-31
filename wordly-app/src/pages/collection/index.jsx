import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import styles from './collection.module.scss';
import { Button } from "primereact/button";
import { useRef, useState, useEffect } from "react";
import { Toast } from 'primereact/toast';
import { Menu } from "primereact/menu";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field } from 'formik';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import collectionService from "../../services/collectionService";
import TermCard from "../../components/termin-card";
import { PageLoader } from "../../components/page-loader";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from 'primereact/inputnumber';
import { useFormik } from 'formik';

const CollectionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    const menuRef = useRef(null);
    const [selectedTerms, setSelectedTerms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);

    const [collection, setCollection] = useState({});

    const [isOpenLearn, setIsOpenLearn] = useState(false);

    useEffect(() => {
        fetchCollection(id);
    }, [])

    const fetchCollection = async (id) => {
        const response = await collectionService.getCollection(id);
        if (response.isSuccessed) {
            setCollection(response.data);
        }

        setLoading(prev => !prev);
    }

    const deleteCollection = async () => {
        const response = await collectionService.deleteCollection(id);
        if (response.isSuccessed) {
            setCollection(response.data);
        }
        navigate('/collections');
    }

    const deleteConfirmDialog = () => {
        confirmDialog({
            message: 'Are you sure you want to delete collection?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            draggable: false,
            accept: async () => {
                await deleteCollection();
            },
        });
    };

    const items = [
        {
            label: 'Edit',
            icon: 'pi pi-refresh',
            command: () => {
                setIsOpenEdit(prev => !prev)
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: deleteConfirmDialog
        }
    ];

    const confirmDelete = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: deleteTerms,
        });
    };

    const deleteTerms = async () => {
        const ids = selectedTerms.map(selectedTerm => selectedTerm.id)
        const model = {
            ids: ids
        }

        const response = await collectionService.deleteTermsFromCollection(id, model);
        if (response.isSuccessed) {
            setSelectedTerms([]);
            setCollection(prev => ({
                ...prev,
                terms: prev.terms.filter((term) => !ids.includes(term.id))
            }));

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Terms deleted successfully', life: 3000 });
        }
    }

    const collectionInitialValues = () => ({
        name: collection.name,
        description: collection.description,
    });

    const validateEditCollectionForm = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Name is required';
            toast.current.show({ severity: 'error', summary: 'Error', detail: errors.name, life: 3000 });
        }

        return errors;
    };

    const onSubmitEditCollectionForm = async (id, values) => {
        setIsEditLoading(prev => !prev);

        const response = await collectionService.updateCollection(id, values);
        if (response.isSuccessed) {
            setCollection(prev => ({
                ...prev,
                name: response.data.name,
                description: response.data.description
            }));

            setIsOpenEdit(prev => !prev)
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Collection successfully updated', life: 3000 });
        }
        setIsEditLoading(prev => !prev);

    }

    const formik = useFormik({
        initialValues: {
            single: true,
            written: false,
            match: false,
            quantity: 20
        },
        validate: (data) => {
            let errors = {};

            return errors;
        },
        onSubmit: (data) => {
            navigate(`/learns/${collection.id}`, {
                state: {
                    ...data
                }
            })

            formik.resetForm();
        }
    });


    return (
        <div>
            {loading && <PageLoader />}
            <Toast ref={toast} />
            <Menu model={items} popup ref={menuRef} id="popup_menu_left" />
            <Dialog
                header="Learn"
                visible={isOpenLearn}
                onHide={() => setIsOpenLearn(prev => !prev)}
                draggable={false}
            >
                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                    <div className="py-4">
                        <div className="flex justify-content-between mb-2">
                            <label className="font-semibold">Single</label>
                            <InputSwitch
                                name="single"
                                checked={formik.values.single}
                                onChange={(event) => {
                                    formik.setFieldValue('single', event.value);
                                }} />
                        </div>
                        <div className="flex justify-content-between  mb-2">
                            <label className="font-semibold">Written</label>
                            <InputSwitch
                                name="written"
                                checked={formik.values.written}
                                onChange={(event) => {
                                    formik.setFieldValue('written', event.value);
                                }} />
                        </div>
                        <div className="flex justify-content-between  mb-2">
                            <label className="font-semibold">Match</label>
                            <InputSwitch
                                name="match"
                                checked={formik.values.match}
                                onChange={(event) => {
                                    formik.setFieldValue('match', event.value);
                                }} />
                        </div>
                        <div className="mt-2 flex justify-content-between align-items-center">
                            <label className="font-semibold">Questions</label>
                            <InputNumber
                                name="quantity"
                                style={{ width: '20%', }}
                                useGrouping={false}
                                value={formik.values.quantity}
                                min={1}
                                onChange={(event) => formik.setFieldValue('quantity', event.value)} />
                        </div>
                    </div>
                    <div className="flex justify-content-end mt-4">
                        <Button
                            disabled={!formik.values.written && !formik.values.single && !formik.values.match}
                            label="Start test"
                            type="submit" />
                    </div>
                </form>
            </Dialog>

            <Dialog
                className={styles.modal__container}
                header="Edit collection"
                visible={isOpenEdit}
                onHide={() => setIsOpenEdit((prev) => !prev)}
                draggable={false}>
                <Formik
                    initialValues={collectionInitialValues()}
                    validate={validateEditCollectionForm}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={async (values, actions) => {
                        await onSubmitEditCollectionForm(id, values);
                        actions.resetForm();
                    }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <p>Name</p>
                            <Field type="text" name="name" as={InputText} />
                            <p>Description</p>
                            <Field
                                name="description"
                                as={InputTextarea}
                                style={{ width: '100%' }}
                                autoResize />
                            <div className="flex justify-content-end mt-2">
                                <Button label="Edit" type="submit" disabled={isSubmitting} loading={isEditLoading} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            <ConfirmPopup />

            <Header />

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.inner}>
                        <div className={styles.left}>
                            {collection.imageUrl &&
                                <img height={128} width={128} src={collection.imageUrl} />
                            }
                            <div className={styles.header__info}>
                                <h3>{collection.name}</h3>
                                <p className={styles.description}>{collection.description}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button
                            icon="pi pi-ellipsis-v"
                            link
                            severity="secondary"
                            text
                            onClick={(event) => menuRef.current.toggle(event)} />
                    </div>
                </div>

                <div className="py-2 flex justify-content-between">
                    {(collection.terms && collection.terms.length) ? <div className="flex">
                        <Button label="Flashcards" className="mr-2" onClick={() => navigate(`/flashcards/${collection.id}`)} />
                        <Button label="Learn" onClick={() => setIsOpenLearn(prev => !prev)} />
                    </div> : <h2 className="text-500 font-normal">The collection is empty</h2>}
                    {selectedTerms.length > 0 &&
                        <div className="flex align-items-center">
                            <span className="mr-2">{selectedTerms.length} items selected</span>
                            <Button label="Remove" severity="danger" onClick={event => confirmDelete(event)} />
                        </div>
                    }
                </div>

                <div className={styles.cards}>
                    {collection.terms && collection.terms.map((term, index) => {
                        return <TermCard term={term} key={index} setSelectedTerms={setSelectedTerms} selectedTerms={selectedTerms} />
                    })}
                </div>
            </div>
        </div>
    );
}

export default CollectionPage;

