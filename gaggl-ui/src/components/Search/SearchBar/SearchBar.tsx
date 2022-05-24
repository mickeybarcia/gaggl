import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import FilterSearch from './FilterSearch';

type Props = {
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onChangeDistance: (distance: number) => void;
  distance?: number;
  tags: string[];
};

const SearchBar: React.FC<Props> = ({
  onAddTag,
  onRemoveTag,
  onChangeDistance,
  distance,
  tags
}) => {
  const distanceValidation = Yup.object().shape({
    distance: Yup.number().min(1).max(300)
  });

  const handleChangeDistance = async (value: { distance: number }) => {
    const { distance } = value;
    onChangeDistance(distance);
  };

  return (
    <div className="m-5">
      <div className="col-md-3 card card-container">
        <FilterSearch onAddTag={onAddTag} onRemoveTag={onRemoveTag} tags={tags} />
        <br />
        <Formik
          initialValues={{ distance: 1 }}
          validationSchema={distanceValidation}
          onSubmit={handleChangeDistance}>
          {(formik) => (
            <Form className="">
              <div className="form-group mt-2">
                <label htmlFor="distance">distance: {distance} miles</label>
                <Field name="distance" type="text" className="form-control" />
                <ErrorMessage name="distance" component="div" className="alert alert-danger" />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-dark btn-block"
                  disabled={formik.isSubmitting}>
                  <span>set</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SearchBar;
