import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import termService from "../../../services/termService";
import { useFormik } from "formik";

const CreateTermModal = ({ open, onOpen, onCreate }) => {
    const toast = useRef(null);
    const [createTermLoading, setCreateTermLoading] = useState(false);
    const uploadImageRef = useRef(null);

    const validate = (values) => {
        const errors = {};

        if (!values.term) {
            errors.term = 'Required';
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'The term can\'t be empty', life: 3000 });

        }

        if (!values.definition) {
            errors.definition = 'Required';
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'The definition can\'t be empty', life: 3000 });
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            term: '',
            definition: '',
            tags: [],
            image: null,
        },
        validateOnChange: false,
        validateOnBlur: false,
        validate,
        onSubmit: async (values) => {
            await createTerm(values);
        },
    });

    const clearFormikValues = () => {
        formik.values.term = '';
        formik.values.definition = '';
        formik.values.tags = [];
        formik.values.image = null;
        formik.values.description = '';
    }

    const createTerm = async (model) => {
        setCreateTermLoading(prev => !prev);

        const formData = new FormData();
        formData.append('Term', model.term);
        formData.append('Definition', model.definition);
        model.tags.forEach(tag => {
            formData.append('Tags', tag)
        });
        formData.append('Image', model.image);
        formData.append('Description', model.description);

        const response = await termService.createTerm(formData);
        if (response.isSuccessed) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Th term added successfully', life: 3000 });
            onCreate(prev => [response.data, ...prev]);
            clearFormikValues();
            uploadImageRef.current.clear();
        }

        setCreateTermLoading(prev => !prev)
    }

    return (
        <div>
            <Toast ref={toast} />
            <Dialog
                className='mx-2'
                draggable={false}
                header="Term details"
                visible={open}
                onHide={() => onOpen(prev => !prev)} >
                <form className='modal-content max-w-30rem min-w-30rem' onSubmit={formik.handleSubmit}>
                    <div className="card flex flex-column">
                        <p className='text-xl font-medium'>Term</p>
                        <InputTextarea
                            name="term"
                            onChange={formik.handleChange}
                            value={formik.values.term}
                            autoResize
                            rows={5}
                            cols={30}
                            placeholder='Term'
                        />
                    </div>
                    <div className="card flex flex-column">
                        <p className='text-xl font-medium'>Definition</p>
                        <InputTextarea
                            name="definition"
                            onChange={formik.handleChange}
                            value={formik.values.definition}
                            autoResize
                            rows={5}
                            cols={30}
                            placeholder='Definition'
                        />
                    </div>
                    <div className="card flex flex-column">
                        <p className='text-xl font-medium'>Description</p>
                        <InputTextarea
                            name="description"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                            autoResize
                            rows={5}
                            cols={30}
                            placeholder='Description'
                        />
                    </div>
                    <div className="card flex flex-column">
                        <p className='text-xl font-medium'>Tags</p>
                        <div>
                            <TagsInput
                                name="tags"
                                value={formik.values.tags}
                                onChange={(tags) => formik.setFieldValue('tags', tags)}
                                placeHolder="Enter tags"
                            />
                        </div>
                    </div>
                    <div>
                        <p className='text-xl font-medium'>Image</p>
                        <FileUpload
                            ref={uploadImageRef}
                            customUpload
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                            onSelect={(event) => {
                                formik.setFieldValue('image', event.files[0]);
                            }}
                        />
                    </div>
                    <div className='flex justify-content-end mt-5'>
                        <Button label='Add' type="submit" loading={createTermLoading} />
                    </div>
                </form>
            </Dialog>
        </div>

    );
}

export default CreateTermModal;