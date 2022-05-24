import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

type Props = {
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  tags: string[];
};

const FilterSearch: React.FC<Props> = ({ onAddTag, onRemoveTag, tags }) => {
  const tagValidation = Yup.object().shape({
    tag: Yup.string()
  });

  const handleAddTag = async (value: { tag: string }) => {
    const { tag } = value;
    const _tag = tag.trim(); // TODO use validation api
    if (_tag.length > 1) onAddTag(_tag);
  };

  const handleRemoveTag = async (tag: string) => onRemoveTag(tag);

  return (
    <div>
      <div className="mt-2 mb-2">current tags: </div>
      <div className="d-flex container flex-wrap">
        {tags.map((tag: string) => (
          <span key={tag}>
            <mark className="m-1 bg-warning" onClick={() => handleRemoveTag(tag)}>
              {tag}
              <strong> ×</strong>
            </mark>
          </span>
        ))}
      </div>
      <br />
      <Formik
        initialValues={{ tag: '' }}
        validationSchema={tagValidation}
        onSubmit={(values, { resetForm }) => {
          handleAddTag(values);
          resetForm();
        }}>
        {(formik) => (
          <Form className="">
            <div className="form-group mt-2">
              <label htmlFor="tag">search tags:</label>
              <Field name="tag" type="text" className="form-control" />
              <ErrorMessage name="tag" component="div" className="alert alert-danger" />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-dark btn-block"
                disabled={formik.isSubmitting}>
                <span>add</span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FilterSearch;
