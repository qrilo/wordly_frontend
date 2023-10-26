import { Button } from "primereact/button";
import Header from "../../components/header";
import { InputText } from "primereact/inputtext";
import CollectionCard from "../../components/collection-card";
import { useEffect, useRef, useState } from "react";
import { Paginator } from 'primereact/paginator';
import styles from './collections.module.scss';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field } from 'formik';
import collectionService from "../../services/collectionService";
import { Loader } from '../../components/loader';

const CollectionsPage = () => {
    const [first, setFirst] = useState(1); // active page
    const [rows, setRows] = useState(10); //quantity on page
    const toast = useRef(null);

    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paging, setPaging] = useState({
        currentPage: 1,
        itemsTotalCount: 0,
        totalPagesCount: 0
    });

    const searchRef = useRef();

    useEffect(() => {
        fetchCollecions();
    }, [])

    const fetchCollecions = async (page = 1, pageSize = rows) => {
        setLoading(prev => !prev)

        const model = {
            page: page,
            pageSize: pageSize
        }

        const response = await collectionService.getCollections(model);
        if (response.isSuccessed) {
            setCollections(response.data.items);
            setPaging({
                currentPage: response.data.currentPage,
                itemsTotalCount: response.data.itemsTotalCount,
                totalPagesCount: response.data.totalPagesCount
            })
        }

        setLoading(prev => !prev)
    }

    // add collection modal
    const [isOpenAddCollection, setIsOpenAddCollection] = useState(false);
    const [addCollectionLoading, setAddCollectionLoading] = useState(false);

    const onPageChange = async (event) => {
        const page = event.first / event.rows + 1;
        setFirst(event.first)
        await fetchCollecions(page);
    };

    const collectionInitialValues = () => ({
        name: '',
        description: '',
    });

    const validateAddCollectionForm = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Name is required';
            toast.current.show({ severity: 'error', summary: 'Error', detail: errors.name, life: 3000 });
        }

        return errors;
    };

    const onSubmitAddCollectionForm = async (values) => {
        setAddCollectionLoading(prev => !prev);

        const response = await collectionService.createCollection(values);
        if (response.isSuccessed) {

            setCollections(prev => [response.data, ...prev])

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Сollection successfully created', life: 3000 });
        }

        setAddCollectionLoading(prev => !prev);
    }

    const searchCollection = async () => {
        if (searchRef.current.value.length <= 0) {
            await fetchCollecions();

            return;
        }

        const model = {
            name: searchRef.current.value
        }

        const response = await collectionService.searchCollection(model);
        if (response.isSuccessed) {
            setCollections(response.data);
            setPaging({
                currentPage: 1,
                itemsTotalCount: 0,
                totalPagesCount: 0
            });
        }
    }

    return (
        <div>
            <Toast ref={toast} />
            <Header />
            <Dialog
                className={styles.modal__container}
                header="Create new collection"
                visible={isOpenAddCollection}
                onHide={() => setIsOpenAddCollection((prev) => !prev)}
                draggable={false}>
                <Formik
                    initialValues={collectionInitialValues()}
                    validate={validateAddCollectionForm}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={async (values, actions) => {
                        await onSubmitAddCollectionForm(values);
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
                                <Button label="Create" type="submit" loading={addCollectionLoading} disabled={isSubmitting} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            <div className={styles.collections__container}>
                <div className="p-3">
                    <div className={styles.collections__action}>
                        <Button
                            label="Create"
                            icon="pi pi-plus"
                            severity="success"
                            onClick={() => setIsOpenAddCollection(prev => !prev)} />
                        <div className={styles.search__cotainer}>
                            <InputText placeholder="Search" ref={searchRef} />
                            <div className={styles.search__button__container}>
                                <Button label="Search" onClick={searchCollection} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.cards}>
                        {collections.length <= 0 &&
                            <div>
                                <h4>No collections</h4>
                            </div>
                        }
                        {loading &&
                            <div className={styles.cards__loading}>
                                <div className={styles.loading__inner}>
                                    <Loader />
                                </div>
                            </div>}
                        {collections.map((collection, index) => {
                            return <CollectionCard collection={collection} key={index} />
                        })}
                    </div>
                    {paging.totalPagesCount > 1 &&
                        <div>
                            <Paginator first={first} rows={rows} totalRecords={paging.itemsTotalCount} onPageChange={onPageChange} />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default CollectionsPage;