<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片式图 -->
        <el-card>
            <!-- 头部警告 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                :closable="false"
                show-icon
            ></el-alert>
            <!-- 选择商品属性区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类: </span>
                    <el-cascader
                        :props="cateProps"
                        :options="cateList"
                        v-model="selectedCateKeys"
                        @change="handleChange"
                        :clearable="true"
                    ></el-cascader>
                </el-col>
            </el-row>
            <!-- tabs页签区 -->
            <el-tabs v-model="activeName" @tab-click="handleChange">
                <el-tab-pane label="动态属性" name="many">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="addDialog = true"
                        >添加参数</el-button
                    >
                    <!-- 动态表格 -->
                    <el-table :data="manyTableData">
                        <el-table-column type="expand">
                            <template scope="scope">
                                <el-tag
                                    closable
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    @close="handleClosed(i, scope.row)"
                                    >{{ item }}</el-tag
                                >
                                <!-- 提供每一行单独的输入框可见和数据绑定 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(scope.row)
                                    "
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="#"
                        ></el-table-column>
                        <el-table-column
                            label="参数名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作" scope="scope">
                            <template scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                ></el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="deleteParams(scope.row.attr_id)"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="addDialog = true"
                        >添加属性</el-button
                    >
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData">
                        <el-table-column type="expand">
                            <template scope="scope">
                                <el-tag
                                    closable
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    @close="handleClosed(i, scope.row)"
                                    >{{ item }}</el-tag
                                >
                                <!-- 提供每一行单独的输入框可见和数据绑定 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(scope.row)
                                    "
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="#"
                        ></el-table-column>
                        <el-table-column
                            label="属性名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作" scope="scope">
                            <template scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                ></el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="deleteParams(scope.row.attr_id)"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog
            :title="activeName == 'many' ? '添加动态参数' : '添加静态属性'"
            :visible.sync="addDialog"
            width="50%"
            @close="addDialogClosed"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="100px"
            >
                <el-form-item label="参数名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 控制文本框和添加tag的值
            inputVisible: false,
            // 添加新的tag的值
            inputValue: '',
            cateList: [],
            cateProps: {
                children: 'children',
                value: 'cat_id',
                label: 'cat_name',
                expandTrigger: 'hover'
            },
            selectedCateKeys: [],
            activeName: 'many',
            // 动态参数数据
            manyTableData: [],
            // 静态属性数据
            onlyTableData: [],
            addDialog: false,
            addFormRules: {
                name: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }
                ]
            },
            addForm: {
                name: ''
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories/')
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.cateList = res.data
            }
        },
        // 切换类别/tabs以及添加修改删除后刷新列表
        async handleChange() {
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
            } else {
                // - 请求路径：categories/:id/attributes
                // - 请求方法：get
                // 根据获取的id和面板获取对应的参数
                const {
                    data: res
                } = await this.$http.get(
                    `categories/${this.cateId}/attributes`,
                    { params: { sel: this.activeName } }
                )
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                } else {
                    res.data.forEach(item => {
                        item.attr_vals =
                            item.attr_vals === ''
                                ? []
                                : item.attr_vals.split(' ')
                        // 控制文本的显示与隐藏
                        item.inputValue = ''
                        item.inputVisible = false
                    })
                    console.log(res.data)
                    if (this.activeName === 'many') {
                        this.manyTableData = res.data
                    } else {
                        this.onlyTableData = res.data
                    }
                }
            }
        },
        addParams() {
            // - 请求路径：categories/:id/attributes
            // - 请求方法：post
            this.$refs.addFormRef.validate(async valid => {
                if (valid) {
                    const { data: res } = await this.$http.post(
                        `categories/${this.cateId}/attributes`,
                        {
                            attr_name: this.addForm.name,
                            attr_sel: this.activeName
                        }
                    )
                    if (res.meta.status !== 201) {
                        this.$message.error(res.meta.msg)
                    } else {
                        this.$message.success(res.meta.msg)
                        this.handleChange()
                        this.addForm.name = ''
                        this.addDialog = false
                    }
                }
            })
        },
        addDialogClosed() {
            this.addForm.name = ''
        },
        async deleteParams(id) {
            // - 请求路径： categories/:id/attributes/:attrid
            // - 请求方法：delete
            const { data: res } = await this.$http.delete(
                `categories/${this.cateId}/attributes/${id}`
            )
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.$message.success(res.meta.msg)
                this.handleChange()
            }
        },
        // 文本框输入焦点或者按下enter
        handleInputConfirm(row) {
            if (row.inputValue.trim().length !== 0) {
                row.attr_vals.push(row.inputValue.trim())
            } else {
                // 发起请求，保存操作
                this.updateAttrVal(row)
            }
            row.inputValue = ''
            row.inputVisible = false
        },
        // 显示输入框
        showInput(row) {
            row.inputVisible = true
            // 让文本框获得焦点
            // $nextTick(): 当页面元素被重新渲染之后，才会执行函数的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // 删除对应tag
        handleClosed(index, row) {
            row.attr_vals.splice(index, 1)
            this.updateAttrVal(row)
        },
        async updateAttrVal(row) {
            // - 请求路径：categories/:id/attributes/:attrId
            // - 请求方法：put
            const { data: res } = await this.$http.put(
                `categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                }
            )
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.$message.success(res.meta.msg)
                // this.handleChange()
            }
        }
    },
    computed: {
        isBtnDisabled() {
            if (this.selectedCateKeys.length !== 3) {
                return true
            } else {
                return false
            }
        },
        // 获取当前选择的三级id
        cateId() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[this.selectedCateKeys.length - 1]
            } else {
                return null
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-cascader {
  margin-left: 15px;
  width: 250px;
}

.input-new-tag {
  width: 150px;
}
</style>
