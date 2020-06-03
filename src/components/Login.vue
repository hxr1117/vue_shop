<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avater_box">
                <img src="../assets/logo.png" alt="" srcset="">
            </div>
            <!-- 表单 -->
            <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-key" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">Login</el-button>
                    <el-button type="info" @click="resetLoginForm">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 绑定表单的数据对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetLoginForm () {
            this.$refs.loginFormRef.resetFields()
        },
        login () {
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) {}
                const { data: res } = await this.$http.post('login', this.loginForm)
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                } else {
                    this.$message.success(res.meta.msg)
                    window.sessionStorage.setItem('token', res.data.token)
                    this.$router.push('/home')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;

        .avater_box {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            overflow: hidden;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            background-color: #fff;
            img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
                background-color: #eee;
            }
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns {
        display: flex;
        float: right;
    }
</style>
