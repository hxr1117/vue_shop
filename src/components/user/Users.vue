<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片式图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        :clearable="true"
                        @clear="getUserList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>
            <el-table :data="userlist" style="width: 100%;">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="180">
                </el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="userStateChanged(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row.id)"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="removeUser(scope.row.id)"
                        ></el-button>
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <!-- 内容主题区/添加用户表单 -->
            <el-form
                status-icon
                label-width="70px"
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form
                :model="editForm"
                status-icon
                :rules="editFormRules"
                ref="editFormRef"
                label-width="70px"
            >
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model.number="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^1(3|4|5|7|8)\d{9}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机'))
        }
        return {
            // 获取用户列表参数
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                pagesize: 2
            },
            userlist: [],
            total: 0,
            addDialogVisible: false,
            editDialogVisible: false,
            // 添加表单数据绑定
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addFormRules: {
                username: [
                    {
                        min: 3,
                        max: 10,
                        message: '长度在3-10之间'
                    },
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 16,
                        message: '长度在6-16之间'
                    }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'bulr' }
                ],
                mobile: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'bulr' }
                ]
            },
            editForm: {},
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'bulr' }
                ],
                mobile: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'bulr' }
                ]
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.userlist = res.data.users
            this.total = res.data.total
            console.log(res)
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听用户状态改变
        async userStateChanged(userInfo) {
            // 请求路径：users/:uId/state/:type
            const { data: res } = await this.$http.put(
                `users/${userInfo.id}/state/${userInfo.mg_state}`
            )
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
                userInfo.mg_status = !userInfo.mg_status
            } else {
                this.$message.success(res.meta.msg)
            }
            console.log(res)
        },
        // 监听对话框关闭
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (valid) {
                    const { data: res } = await this.$http.post(
                        'users',
                        this.addForm
                    )
                    if (res.meta.status !== 201) {
                        this.$message.error(res.meta.msg)
                    } else {
                        this.$message.success(res.meta.msg)
                        this.addDialogVisible = false
                        this.getUserList()
                    }
                }
            })
        },
        async showEditDialog(id) {
            const { data: res } = await this.$http.get('users/' + id)
            console.log(res)
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            }
            this.editDialogVisible = true
            this.editForm = res.data
        },
        editUserInfo() {
            // 请求路径：users/:id
            this.$refs.editFormRef.validate(async valid => {
                if (valid) {
                    const { data: res } = await this.$http.put(
                        'users/' + this.editForm.id,
                        {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        }
                    )
                    console.log(res)
                    if (res.meta.status !== 200) {
                        this.$message.error(res.meta.msg)
                        return
                    }
                    this.editDialogVisible = false
                    this.getUserList()
                    this.$message.success(res.meta.msg)
                }
            })
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        async removeUser(id) {
            // 请求路径：users/:id
            // 请求方法：delete
            // 删除弹窗
            const res = await this.$confirm(
                '此操作将永久删除该用户, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (res === 'confirm') {
                const { data: res } = await this.$http.delete('users/' + id)
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                } else {
                    this.$message.success(res.meta.msg)
                    this.getUserList()
                }
            } else {
                this.$message.info('已取消删除')
            }
        }
    }
}
</script>

<style lang="less" scoped></style>
