import React, { useCallback } from "react";
import { Form, reduxForm, InjectedFormProps } from "redux-form";
import { CREATE_ORGANIZATION_FORM_NAME } from "constants/forms";
import {
  CreateOrganizationFormValues,
  createOrganizationSubmitHandler,
} from "./helpers";
import { noSpaces } from "utils/formhelpers";
import TextField from "components/editorComponents/form/fields/TextField";
import FormGroup from "components/editorComponents/form/FormGroup";
import FormFooter from "components/editorComponents/form/FormFooter";
import FormMessage from "components/editorComponents/form/FormMessage";

// TODO(abhinav): abstract onCancel out.
export function CreateApplicationForm(
  props: InjectedFormProps<
    CreateOrganizationFormValues,
    { onCancel: () => void }
  > & {
    onCancel: () => void;
  },
) {
  const {
    error,
    handleSubmit,
    pristine,
    submitting,
    invalid,
    onCancel,
  } = props;
  const submitHandler = useCallback(
    async (data, dispatch) => {
      const result = await createOrganizationSubmitHandler(data, dispatch);
      if (typeof onCancel === "function") onCancel(); // close after submit
      return result;
    },
    [handleSubmit, onCancel],
  );

  return (
    <Form
      data-cy="create-organisation-form"
      onSubmit={handleSubmit(submitHandler)}
    >
      {error && !pristine && <FormMessage intent="danger" message={error} />}
      <FormGroup helperText={error} intent={error ? "danger" : "none"}>
        <TextField
          autoFocus
          data-cy="create-organisation-form__name"
          name="name"
          placeholder="Name"
          validate={noSpaces}
        />
      </FormGroup>
      <FormFooter
        canSubmit={!invalid}
        data-cy="t--create-org-submit"
        divider
        onCancel={onCancel}
        onSubmit={handleSubmit(submitHandler)}
        size="small"
        submitOnEnter
        submitText="Submit"
        submitting={submitting && !error}
      />
    </Form>
  );
}

export default reduxForm<
  CreateOrganizationFormValues,
  { onCancel: () => void }
>({
  form: CREATE_ORGANIZATION_FORM_NAME,
})(CreateApplicationForm);
