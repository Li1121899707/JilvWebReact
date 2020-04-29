<template>
    <Row>
        <Col span="6" offset="9" style="padding-top:100px">
            <Card>
                <div style="text-align:center;width:100%; padding:20px 0">
                    <h2>管理员登录</h2>
                </div>
                <Form ref="formInline" :model="formInline" :rules="ruleInline">
                    <FormItem prop="username">
                        <Input type="text" v-model="formInline.username" placeholder="用户名">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="formInline.password" placeholder="密码">
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Col offset="11">
                            <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
                        </Col>
                    </FormItem>
                </Form>
            </Card>
        </Col>
    </Row>
    
</template>
<script>
import {post} from '@/utils/http'

    export default {
        data () {
            return {
                formInline: {
                    username: 'ly',
                    password: '123456'
                },
                ruleInline: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var values = this.formInline;
                        // 执行登录
                        this.$router.push({path:'/admin'});
                            post('authenticate', values).then(res => {
                            const data = res.data
                            sessionStorage.clear() // 重新登录时，需要清楚之前的session
                            sessionStorage.setItem('token', data.id_token)
                            sessionStorage.setItem('USERNAME', data.userName)
                            this.$router.push({path:'/admin'});
                        })
                        
                    } else {
                        this.$Message.error('验证失败，检查您的输入');
                    }
                })
            }
        }
    }
</script>
