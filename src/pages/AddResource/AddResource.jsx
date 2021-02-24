import React, { Component } from "react";

let blankFormData = {
  title: "",
  description: "",
  url: "",
  type: "",
};

class AddResource extends Component {
  state = {
    invalidForm: true,
    formData: {
      title: "",
      description: "",
      url: "",
      type: "",
    },
  };

  formRef = React.createRef();

  handleChange = (e) => {
    const formData = {
        ...this.state.formData, [e.target.name]: e.target.value,
    }
    this.setState({
        formData: formData, 
        invalidForm: !this.formRef.current.checkValidity(),
    })
  };

  handleSubmit = (e) => {
  e.preventDefault();
    this.props.handleAddResource(this.state.formData);
    this.setState((state) => ({
      formData: blankFormData,
    }));
  }

  render() {
    return (
      <>
        <h2>Resources</h2>
        <div id="add-resource-form">
          <h3>Create A Resource</h3>
          <form ref={this.formRef} onSubmit={this.handleSubmit}>
            <div id="add-resource-info">
              <label htmlFor="resource_title">Title</label>
              <input
                name="title"
                id="resource_title"
                type="text"
                value={this.state.formData.title}
                onChange={this.handleChange}
                required
              />
              <label htmlFor="resource_description">Description</label>
              <input
                name="description"
                id="resource_description"
                type="text"
                value={this.state.formData.description}
                onChange={this.handleChange}
                required
              />
              <label htmlFor="resource_url">Url</label>
              <input
                name="url"
                id="resource_url"
                type="text"
                value={this.state.formData.url}
                onChange={this.handleChange}
                required
              />
              <label htmlFor="resource_title">Type</label>
              <input
                name="type"
                id="resource_type"
                type="text"
                value={this.state.formData.type}
                onChange={this.handleChange}
                required
              />
            </div>
            <button type="submit" disabled={this.state.invalidForm}>
              Create Resource
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default AddResource;
