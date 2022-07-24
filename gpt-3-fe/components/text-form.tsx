import {FC} from "react";
import {ErrorMessage, Field, Form, Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import styles from "../styles/index.module.css";

const schema = yup.object({
    text: yup.string()
        .max(256, 'Must be 256 characters or less')
        .required('Required')
})

interface IPostPromptFormProps<T> {
    handleSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>
}


const TextForm: FC<IPostPromptFormProps<{ text: string }>> = ({handleSubmit}) => {
    return (
        <Formik
            initialValues={{text: ''}}
            validationSchema={schema}
            onSubmit={handleSubmit}
        >
            <Form>
                <div className={styles.formField}>
                    <Field name="text" as="textarea"/>
                    <ErrorMessage name="text"/>
                </div>
                <button type="submit">Generate</button>
            </Form>
        </Formik>
    );

}

export default TextForm;