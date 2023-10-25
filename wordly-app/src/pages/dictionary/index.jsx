import { Button } from 'primereact/button';
import Header from '../../components/header';
import styles from './dictionary.module.scss'
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { lazy, useEffect, useRef, useState } from 'react';
import termService from '../../services/termService';
import CreateTermModal from '../../components/term/create-term';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { TagsInput } from 'react-tag-input-component';
import { Image } from 'primereact/image';
import { FileUpload } from 'primereact/fileupload';
import { InputSwitch } from 'primereact/inputswitch';
import { Formik, Field, Form } from 'formik';
import collectionService from '../../services/collectionService';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

const DictionaryPage = () => {
    const [addTermModal, setIsOpenCreateTermModal] = useState(false);

    const [openIsDetailTermModal, setOpenIsDetailTermModal] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);

    const [editIsEnable, setEditIsEnable] = useState(false);
    const [editImage, setEditImage] = useState(null);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const editImageRef = useRef(null);
    const [loadingDeleteImage, setLoadingDeleteImage] = useState(false);

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [terms, setTerms] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedTerms, setSelectedTerms] = useState([]);

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 25,
        page: 0,
        sortField: null,
        sortOrder: null,
    });
    const [page, setPage] = useState(0);

    const toast = useRef(null);

    const [addToCollection, setAddToCollection] = useState(false);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [addToCollectionLoading, setAddToCollectionLoading] = useState(false);

    const [filtersIsOpen, setFiltersIsOpen] = useState(false);
    const searchPhraseRef = useRef();
    const [termCheck, setTermCheck] = useState(true);
    const [definitionCheck, setDefinitionCheck] = useState(false);
    const [filtersLoading, setFiltersLoading] = useState(false);

    useEffect(() => {
        getTerms();
    }, []);

    const parseSortDirection = (event) => {
        if (event.sortOrder > 0) {
            return 'asc'
        }

        return 'desc'
    }


    const getTerms = async (page = 1) => {
        setLoading(true);

        const model = {
            page: page,
            pageSize: lazyState.rows,
            sortDirection: 'desc',
        }

        const response = await termService.getTerms(model);

        if (response.isSuccessed) {
            setTerms(response.data.items);
            setTotalRecords(response.data.itemsTotalCount);
        }

        setLoading(false);
    }

    const onPage = async (event) => {
        setSelectAll(false);
        setSelectedTerms([]);
        setPage(event.page);
        setLoading(prev => !prev)

        if (event.sortField !== null) {
            const model = {
                page: event.page + 1,
                pageSize: lazyState.rows,
                sortDirection: parseSortDirection(event),
                sortBy: event.sortField
            }

            const response = await termService.getTerms(model);

            if (response.isSuccessed) {
                setTerms(response.data.items);
                setTotalRecords(response.data.itemsTotalCount);
            }

            setlazyState(event);
            setLoading(prev => !prev)
            return;
        }

        const model = {
            page: event.page + 1,
            pageSize: lazyState.rows,
            sortDirection: parseSortDirection(event),
        }
        const response = await termService.getTerms(model);

        if (response.isSuccessed) {
            setTerms(response.data.items);
            setTotalRecords(response.data.itemsTotalCount);
        }

        setlazyState(event);
        setLoading(prev => !prev)
    };

    const onSort = async (event) => {
        setLoading(prev => !prev)
        const model = {
            page: page + 1,
            pageSize: lazyState.rows,
            sortDirection: parseSortDirection(event),
            sortBy: event.sortField
        }
        const response = await termService.getTerms(model);

        if (response.isSuccessed) {
            setTerms(response.data.items);
            setTotalRecords(response.data.itemsTotalCount);
        }

        setlazyState(event);
        setLoading(prev => !prev)
    };

    const onSelectionChange = (event) => {
        const value = event.value;

        setSelectedTerms(value);
        setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = (event) => {
        const selectAll = event.checked;

        if (selectAll) {
            setSelectAll(true);
            setSelectedTerms(terms);
        } else {
            setSelectAll(false);
            setSelectedTerms([]);
        }
    };

    const removeTerms = async () => {
        const model = {
            ids: selectedTerms.map(term => term.id)
        }

        const response = await termService.removeTerms(model);

        setTerms(prev => prev.filter(term => !selectedTerms.some(selectedTerm => selectedTerm.id === term.id)));

        if (response.isSuccessed) {
            setTerms(prev => prev.filter(term => !selectedTerms.some(selectedTerm => selectedTerm.id === term.id)));
            setSelectedTerms([]);

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Term deleted success', life: 3000 });
        }
    }

    const termTemplate = (rowData) => {
        return (
            <div className='flex align-items-center'>
                <Button
                    icon='pi pi-volume-up'
                    link
                    onClick={() => {
                        const message = new SpeechSynthesisUtterance()
                        message.text = rowData.term
                        window.speechSynthesis.speak(message)
                    }} />
                <span>{rowData.term}</span>
            </div>
        );
    }

    const detailButtonTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button label='Details'
                    onClick={() => {
                        setSelectedTerm(rowData);
                        setOpenIsDetailTermModal(prev => !prev)
                    }} />
            </div>
        );
    };

    const imageTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                {
                    rowData &&
                    <Image src={rowData.imageUrl} zoomSrc={rowData.imageUrl} alt="Image" width="60" height="60" preview />
                }
            </div >
        );
    }

    const addedTemplate = (rowData) => {
        return (
            <div>
                {new Date(rowData.createdAtUtc).toLocaleDateString()}
            </div>
        )
    }

    const confirmRemove = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: removeTerms,
        });
    };

    const validateEditForm = (values) => {
        const errors = {}

        if (!values.term) {
            errors.term = 'The term can\'t be empty';

            toast.current.show({ severity: 'error', summary: 'Error', detail: errors.term, life: 3000 });
        }
        if (!values.definition) {
            errors.definition = 'The definition can\'t be empty';

            toast.current.show({ severity: 'error', summary: 'Error', detail: errors.definition, life: 3000 });
        }

        return errors;
    }

    const updateTerm = async (values) => {
        setLoadingEdit(prev => !prev);

        const model = new FormData();
        model.append('Term', values.term);
        model.append('Definition', values.definition);
        selectedTerm.tags?.forEach(tag => {
            model.append('Tags', tag)
        });
        model.append('Image', editImage);
        model.append('Description', values.description);

        const response = await termService.updateTerm(selectedTerm.id, model);

        if (response.isSuccessed) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'The term has been successfully updated', life: 3000 });
            setSelectedTerm(response.data);

            setTerms(prev => prev.map((term, index) => {
                if (term.id == selectedTerm.id) {
                    return response.data
                }

                return term;
            }));
        }

        setLoadingEdit(prev => !prev);
        editImageRef.current.clear();
    }

    const removeImage = async () => {
        setLoadingDeleteImage(prev => !prev);

        const response = await termService.removeImageTerm(selectedTerm.id);

        if (response.isSuccessed) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'The image has been successfully deleted', life: 3000 });

            setSelectedTerm(prev => ({
                ...prev,
                imageUrl: null
            }))

            setTerms(prev => prev.map(term => {
                if (term.id == selectedTerm.id) {
                    term.imageUrl = null;
                    return term;
                }

                return term;
            }));
        }
        setLoadingDeleteImage(prev => !prev);
    }

    const addTermsToCollection = async () => {
        if (selectedCollection === null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Select collection', life: 3000 });
            return;
        }

        setAddToCollectionLoading(prev => !prev);

        const collectionId = selectedCollection;
        const model = {
            ids: selectedTerms.map(term => term.id)
        };

        const response = await collectionService.addTermsToCollection(collectionId, model);
        if (response.isSuccessed) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Terms successfully added to the collection            ', life: 3000 });

            setAddToCollection(prev => !prev);
            setSelectAll(false);
            setSelectedTerms([]);
        }

        setAddToCollectionLoading(prev => !prev);
    }

    const openAddTermsToCollectionModal = async () => {
        setAddToCollection(prev => !prev);

        const response = await collectionService.getCollectionsInfo();

        if (response.isSuccessed) {
            setCollections(response.data);
        }
    }

    const collectionOptions = collections.map(collection => ({
        label: collection.name,
        value: collection.id
    }));

    const onCollectionChange = (e) => {
        setSelectedCollection(e.value);
    };

    const clearFilters = () => {
        searchPhraseRef.current.value = '';
        setTermCheck(false);
        setDefinitionCheck(false);
    }

    const applyFilters = async () => {
        setFiltersLoading(prev => !prev);
        const searchPhrase = searchPhraseRef.current.value;

        const model = {
            searchPhrase: searchPhrase,
            searchIn: parseSearchIn(),
            page: 1,
            pageSize: lazyState.rows
        }

        const response = await termService.getTerms(model);
        if (response.isSuccessed) {
            setTerms(response.data.items);
            setTotalRecords(response.data.itemsTotalCount);
        }

        setFiltersLoading(prev => !prev);
    }

    const parseSearchIn = () => {
        if (termCheck && definitionCheck) {
            return 'all';
        }

        if (termCheck) {
            return 'term';
        }

        return 'definition';
    }

    return (
        <div className={styles.dictionary__container}>
            <Toast ref={toast} />
            <ConfirmPopup />
            <CreateTermModal open={addTermModal} onOpen={setIsOpenCreateTermModal} onCreate={setTerms} />

            <Dialog
                style={{ width: '40vw' }}
                header='Filters'
                visible={filtersIsOpen}
                draggable={false}
                onHide={() => setFiltersIsOpen(prev => !prev)}
                footer={
                    <div>
                        <Button
                            label='Clear'
                            severity="secondary"
                            icon='pi pi-filter-slash'
                            onClick={clearFilters}
                            loading={filtersLoading} />
                        <Button
                            label='Apply'
                            icon='pi pi-filter'
                            onClick={applyFilters}
                            loading={filtersLoading} />
                    </div>}>
                <div>
                    <div>
                        <p className='font-semibold text-lg'>Search phrase</p>
                        <InputText ref={searchPhraseRef} />
                    </div>
                    <div >
                        <p className='font-semibold text-lg'>Search in</p>
                        <div className='mb-2'>
                            <Checkbox checked={termCheck} onChange={() => setTermCheck(prev => !prev)} />
                            <label className='ml-2'>term</label>
                        </div>
                        <div className='mb-2'>
                            <Checkbox checked={definitionCheck} onChange={() => setDefinitionCheck(prev => !prev)} />
                            <label className='ml-2'>definition</label>
                        </div>
                    </div>
                </div>

            </Dialog>

            <Dialog
                style={{ width: '40vw' }}
                header='Collection'
                visible={addToCollection}
                draggable={false}
                onHide={() => setAddToCollection(prev => !prev)}
                footer={
                    <Button label='Add terms' onClick={addTermsToCollection} loading={addToCollectionLoading} />
                }>
                <p>Select collection:</p>
                <Dropdown className='w-full' value={selectedCollection} options={collectionOptions} onChange={onCollectionChange} />

            </Dialog>

            {selectedTerm && <Dialog
                className='mh-5'
                draggable={false}
                header="Term details"
                visible={openIsDetailTermModal}
                onHide={() => {
                    setOpenIsDetailTermModal(prev => !prev)
                    setSelectedTerm(null);
                    setEditIsEnable(false);
                }} >
                <Formik
                    initialValues={{
                        term: selectedTerm.term,
                        definition: selectedTerm.definition,
                        description: selectedTerm.description
                    }}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={validateEditForm}
                    onSubmit={updateTerm}>
                    <Form>
                        <div className='flex'>
                            <div>
                                <div className='flex align-items-center'>
                                    <p className='mr-2 text-lg font-medium'>Edit</p>
                                    <InputSwitch
                                        checked={editIsEnable}
                                        onChange={() => setEditIsEnable(prev => !prev)} />
                                </div>
                                <div className="card flex flex-column">
                                    <p className='text-xl font-medium'>Term</p>
                                    <Field name="term">
                                        {({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                readOnly={!editIsEnable}
                                                autoResize
                                                rows={5}
                                                cols={30}
                                                placeholder='Term'
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div className="card flex flex-column">
                                    <p className='text-xl font-medium'>Definition</p>
                                    <Field name="definition">
                                        {({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                readOnly={!editIsEnable}
                                                autoResize
                                                rows={5}
                                                cols={30}
                                                placeholder='Definition'
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div className="card flex flex-column">
                                    <p className='text-xl font-medium'>Description</p>
                                    <Field name="description">
                                        {({ field }) => (
                                            <InputTextarea
                                                {...field}
                                                readOnly={!editIsEnable}
                                                autoResize
                                                rows={5}
                                                cols={30}
                                                placeholder='description'
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div className="card flex flex-column">
                                    <p className='text-xl font-medium'>Tags</p>
                                    <div>
                                        <TagsInput
                                            disabled={!editIsEnable}
                                            name="tags"
                                            value={selectedTerm.tags}
                                            onChange={event => setSelectedTerm(prev => ({
                                                ...prev,
                                                tags: event
                                            }))} placeHolder="Enter tags"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-column ml-5'>
                                {selectedTerm.imageUrl ?
                                    <Image src={selectedTerm.imageUrl} alt="Image" width="250" />
                                    :
                                    <div className='w-15rem h-15rem surface-400 flex align-items-center justify-content-center '>
                                        <span className='text-50'>
                                            No Image</span>
                                    </div>
                                }
                                {editIsEnable &&
                                    <div className='flex mt-2 flex-column '>
                                        <FileUpload
                                            className={styles.file__upload}
                                            auto={false}
                                            mode="basic"
                                            accept="image/*"
                                            maxFileSize={1000000}
                                            onSelect={(event) => {
                                                setEditImage(event.files[0]);
                                            }}
                                            ref={editImageRef}
                                        />
                                        {
                                            selectedTerm.imageUrl && <Button
                                                className='mt-2 w-full'
                                                label='Remove image'
                                                severity="danger"
                                                loading={loadingDeleteImage}
                                                onClick={removeImage} />
                                        }
                                        <Button
                                            type="submit"
                                            className='mt-2 w-full'
                                            label='Update'
                                            severity="success"
                                            loading={loadingEdit} />
                                    </div>
                                }
                            </div>
                        </div>
                    </Form>
                </Formik>
            </Dialog>}

            <Header />

            <div className="px-8 mt-2">
                <div className={styles.dictionary__table}>
                    <div className='flex justify-content-between pb-3'>
                        {selectedTerms.length > 0 ? <div className='flex align-items-center'>
                            <span>{selectedTerms.length} items selected</span>
                            <Button label="Add to collection" className='ml-3' onClick={openAddTermsToCollectionModal} />
                            <Button label="Remove" severity="danger" className='ml-3' onClick={confirmRemove} />
                        </div> : <Button label="Add" icon="pi pi-plus" severity="success" onClick={() => setIsOpenCreateTermModal(prev => !prev)} />
                        }
                        <div>
                            <Button
                                onClick={() => setFiltersIsOpen(prev => !prev)}
                                label='Filters'
                                className='ml-3'
                                icon='pi pi-filter' />
                        </div>
                    </div>
                    <div className="card">
                        <DataTable
                            value={terms}
                            lazy
                            selectionMode='checkbox'
                            dataKey="id"
                            paginator
                            rows={lazyState.rows}
                            first={lazyState.first} totalRecords={totalRecords} onPage={onPage}
                            onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                            loading={loading} tableStyle={{ minWidth: '75rem' }}
                            selection={selectedTerms} onSelectionChange={onSelectionChange} selectAll={selectAll} onSelectAllChange={onSelectAllChange}>
                            <Column key="selection" selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                            <Column sortable key="term" field="term" header="Term" body={termTemplate} />
                            <Column key="definition" field="definition" header="Definition" />
                            <Column key="image" field="Image" header="Image" body={imageTemplate} />
                            <Column sortable key="createdAtUtc" field="createdAtUtc" header="Added" body={addedTemplate} />
                            <Column key="details" header="Details" body={detailButtonTemplate} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DictionaryPage;