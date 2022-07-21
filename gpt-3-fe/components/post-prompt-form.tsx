import {FC} from "react";
import {ErrorMessage, Field, Form, Formik, FormikHelpers} from 'formik';
import * as yup from 'yup';
import styles from "../styles/index.module.css";

const schema = yup.object({
    prompt: yup.string()
        .max(256, 'Must be 256 characters or less')
        .required('Required')
})

interface IPostPromptFormProps<T> {
    handleSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>
}


const PostPromptForm: FC<IPostPromptFormProps<{ prompt: string }>> = ({handleSubmit}) => {
    return (
        <Formik
            initialValues={{prompt: ''}}
            validationSchema={schema}
            onSubmit={handleSubmit}
        >
            <Form>
                <div className={styles.formField}>
                    <Field name="prompt" as="textarea"/>
                    <ErrorMessage name="prompt"/>
                </div>
                <button type="submit">Generate</button>
            </Form>
        </Formik>
    );

}

export default PostPromptForm;
