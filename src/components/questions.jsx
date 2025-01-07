import React, {useState, useEffect, useRef} from 'react';
import {Button, Divider, Flex, Image, Input, message, Tabs, Upload} from 'antd';
import {Space, Typography} from 'antd';
import {deleteQuestionByID, searchQuestionByTitle, updateQuestionByID, uploadPicture} from "@/apis/api"
import {useNavigate} from "react-router-dom";
import {UploadOutlined} from "@ant-design/icons";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// import QuillResize  from 'quill-resize-module';

const {Text} = Typography;

const {Search} = Input;

// Quill.register('modules/resize', QuillResize);

const items = [
    {
        key: '1',
        label: '中文',

    },
    {
        key: '2',
        label: '英文',

    },
    {
        key: '3',
        label: '西班牙文',
    },
];

const languageMapping = {
    '1': 'zw', // 中文
    '2': 'yw', // 英文
    '3': 'xby', // 西班牙文
};

const optionMapping = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
};

const QuestionItem = ({questionData}) => {

    const [activeLanguage, setActiveLanguage] = useState('zw'); // 默认语言为中文
    const [localQuestionData, setLocalQuestionData] = useState(questionData); // 本地问题数据
    const [uploadedFileName, setUploadedFileName] = useState(questionData.img);
    const editorRef = useRef(null); // 创建一个 DOM 引用
    const quillInstance = useRef(null); // 存储 Quill 实例


    useEffect(() => {
        if (editorRef.current) {
            // 初始化 Quill 实例
            quillInstance.current = new Quill(editorRef.current, {
                modules: {
                    toolbar: {
                        container: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link', 'image'],
                        ],
                        handlers: {
                            image: () => handleImageInsert(), // 自定义图片插入逻辑
                        },
                    },
                    // resize: true, // 启用 resize 模块
                },
                theme: 'snow', // 使用 Snow 主题
            });
            // 填充初始内容
            if (localQuestionData.zw_daan_jx) {
                quillInstance.current.clipboard.dangerouslyPasteHTML(localQuestionData.zw_daan_jx);
            }
        }
    }, [localQuestionData.zw_daan_jx]);




    // 自定义图片上传逻辑
    const handleImageInsert = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('image', file);
                    uploadPicture(formData).then(
                        res => {
                            if (res.code === 0) {
                                const imageUrl = `http://localhost:8082/static/${res.fileName}`;
                                const range = quillInstance.current.getSelection();
                                quillInstance.current.insertEmbed(range.index, 'image', imageUrl);
                                message.success("插入图片成功")
                            } else {
                                throw new Error("插入图片失败");
                            }
                        }
                    ).catch(
                        err => {
                            message.error("插入图片失败");
                            console.log(err);
                        }
                    )
                } catch (error) {
                    message.error(error);
                }
            }

        }
    }



    const onTabChange = (key) => {
        setActiveLanguage(languageMapping[key]);
    };

    // 更新题目内容
    const handleEditQuestion = (value) => {
        const updatedData = {...localQuestionData};
        updatedData[activeLanguage].name = value;
        setLocalQuestionData(updatedData);
    };

    // 更新选项内容
    const handleEditOption = (value, index) => {
        const updatedData = {...localQuestionData};
        updatedData[activeLanguage].options[Object.keys(updatedData[activeLanguage].options)[index]] = value;
        setLocalQuestionData(updatedData);
    };

    // 更新正确答案
    const handleEditAnswer = (value) => {
        setLocalQuestionData((prev) => ({...prev, daan: value}));
    };


    // 保存所有修改
    const handleSave = () => {

        let updatedData = localQuestionData;
        if (quillInstance.current) {
            const htmlContent = quillInstance.current.root.innerHTML;
            updatedData = {...localQuestionData};
            updatedData.zw_daan_jx = htmlContent;
            setLocalQuestionData(updatedData);
        }
        updatedData.img = uploadedFileName
        // 这里可以调用 API 将 localQuestionData 同步到后端
        updateQuestionByID(updatedData).then(
            res => {
                if (res.code === 0) {
                    message.success("更新成功")
                }
            }
        ).catch(
            err => {
                console.log(err);
                message.error("更新失败");
            }
        )
    };


    const handleDeleteQuestion = () => {
        deleteQuestionByID(localQuestionData.id).then(
            res => {
                if (res.code === 0) {
                    message.success("删除成功")
                }
            }
        ).catch(
            err => {
                console.log(err);
                message.error("删除失败，请重试")
            }
        )
    }


    // 自定义上传
    const customRequest = ({file, onSuccess, onError}) => {
        const formData = new FormData();
        formData.append("image", file); // "image" 与后端接口的字段名一致

        uploadPicture(formData).then(
            res => {
                if (res.code === 0) {
                    setUploadedFileName(res.fileName);
                    message.success("Upload successful!");
                    onSuccess(res, file);
                } else {
                    throw new Error("Upload failed");
                }
            }
        ).catch(
            err => {
                message.error("Upload failed!");
                onError(err);
            }
        )
    }


    return (
        <div>
            <Tabs size={"large"} defaultActiveKey="1" items={items} onChange={onTabChange}/>

            <div style={{marginBottom: "16px"}}>
                <Text
                    editable={{
                        onChange: (value) => handleEditQuestion(value),
                    }}
                    strong
                    style={{fontSize: "18px"}}
                >
                    {localQuestionData[activeLanguage].name}
                </Text>
            </div>
            <div>
                {uploadedFileName == null ? null : <Image
                    width={200}
                    //todo
                    src={"http://localhost:8082/static/" + uploadedFileName}
                />}
            </div>
            <br/>
            <div>
                <Upload
                    listType="picture"
                    customRequest={customRequest} // 使用自定义上传
                    showUploadList={false} // 不显示文件列表
                    accept="image/*" // 限制上传文件类型为图片
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined/>}>Upload (Max: 1)</Button>
                </Upload>
            </div>
            <br/>
            <br/>
            {/* 选项 */}
            <Space direction="vertical" style={{width: "100%"}}>
                {localQuestionData[activeLanguage].options.map((option, index) => (
                    <Flex gap={'middle'} align={'center'} key={index}>
                        <div>
                            {optionMapping[index]}:
                        </div>
                        <Text
                            editable={{
                                onChange: (value) => handleEditOption(value, index),
                            }}
                            style={{fontSize: "16px"}}
                        >
                            {option}
                        </Text>
                    </Flex>
                ))}
            </Space>
            <Divider/>
            <div>
                <Flex gap={'middle'} align={'center'}>
                    <div> 正确答案：</div>
                    <Text
                        editable={{
                            onChange: (value) => handleEditAnswer(value),
                        }}
                        style={{fontSize: "16px"}}
                    >
                        {localQuestionData.zw_daan}
                    </Text>
                </Flex>
            </div>
            <Divider/>
            <div>答案解析</div>
            <br />
            <div>
                <div ref={editorRef} style={{ minHeight: "300px" }}/>
            </div>
            <Divider/>
            <Space size={"large"}>
                <Button onClick={handleSave} type={"primary"}>Save</Button>
                <Button onClick={handleDeleteQuestion} danger>Delete</Button>
            </Space>


        </div>
    )
}


const Questions = () => {


    const navigate = useNavigate()
    const [searchResp, setSearchResp] = useState([]); // 题目


    function onSearch(value, _e, info) {
        searchQuestionByTitle(value).then(
            res => {
                if (res.code === 0) {
                    setSearchResp(res.data)
                }

            }
        ).catch(error => {
            if (error.status === 401) {
                message.error("请先登录")
                navigate("/login")
                return
            }
            message.error("查询失败，请重试")
        })
    }


    return (
        <div className={"questions"}>
            <Search
                placeholder="中文题目搜索"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
            />
            <br/>
            <br/>
            <br/>
            <div>
                {
                    searchResp.map((item, index) => {
                        return (
                            <div className={'question-item'} key={index}>
                                <QuestionItem questionData={item}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default Questions;



