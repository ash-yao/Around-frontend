import React from  'react';
import $ from 'jquery';
import {API_ROOT, TOKEN_KEY, AUTH_PREFIX, POS_KEY, LOC_SHAKE} from "../constants";
import { Modal, Button, message} from 'antd';
import {WrappedCreatePostForm} from "./CreatPostForm";

export class PostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.form.validateFields( (err, values) => {
            if (!err) {
                const {latitude, longitude} = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                formData.set('lat', latitude + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
                formData.set('lon', longitude + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
                formData.set('message', values.message);
                formData.set('image', values.image[0]);

                this.setState({
                    confirmLoading: true,
                });
                $.ajax({
                    url: `${API_ROOT}/post`,
                    method: 'POST',
                    data: formData,
                    headers: {
                        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                    processData: false,
                    contentType: false,
                    dataType: 'text'
                }).then(
                    () => {
                        message.success('created a post successfully.');
                        this.form.resetFields();
                        this.props.loadPosts().then(()=>{
                            this.setState({
                                visible: false,
                                confirmLoading: false,
                            })
                        });
                    }, (error) => {
                        this.setState({confirmLoading: false})
                        message.error(error.responseText);
                    }
                ).catch((error) => {
                    message.error('create post failed');
                    this.setState({confirmLoading: false})
                    console.log(error);
                })
            }
        })
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    saveForm = (form) => {
        this.form = form;
    }
    render() {
        const { visible, confirmLoading} = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Creat New Post</Button>
                <Modal title="Create New Post"
                       visible={visible}
                       onOk={this.handleOk}
                       okText='Create'
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                >
                    <WrappedCreatePostForm ref = {this.saveForm}/>
                </Modal>
            </div>
        );
    }
}