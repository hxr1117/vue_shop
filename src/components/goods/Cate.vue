<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片式图 -->
        <el-card>
            <!-- 添加按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog"
                        >添加分类</el-button
                    >
                </el-col>
            </el-row>

            <!-- 表格 -->
            <zk-table
                :data="cateList"
                :selection-type="false"
                :expand-type="false"
                show-index
                :columns="columns"
                index-text="#"
            >
                <template slot="isok" scope="scope">
                    <i
                        class="el-icon-success"
                        v-if="!scope.row.isdeleted"
                        style="color: #005344;"
                    ></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <template slot="order" scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag v-if="scope.row.cat_level === 1" type="success"
                        >二级</el-tag
                    >
                    <el-tag v-if="scope.row.cat_level === 2" type="warning"
                        >三级</el-tag
                    >
                </template>
                <template slot="opt" scope="scope">
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="editCategory(scope.row.id)"
                    ></el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="deleteCategory(scope.row.id)"
                    ></el-button>
                </template>
            </zk-table>

            <!-- 分页 -->
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

        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加类别"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed"
        >
            <el-form
                :model="addCateForm"
                label-width="100px"
                :rules="addCateRule"
                ref="addCateFormRef"
                status-icon
            >
                <el-form-item label="类别名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- option用来指定数据源 -->
                    <!-- props用来指定配置对象 -->
                    <el-cascader
                        v-model="selectedKey"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChanged"
                        :clearable="true"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品数据列表
            cateList: [],
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 总条数
            total: 0,
            // 表格每列数据项
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    prop: 'cat_deleted',
                    // 定义当前列为模版列
                    type: 'template',
                    // 模版列名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    prop: 'cat_level',
                    type: 'template',
                    // 模版列名称
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    // 模版列名称
                    template: 'opt'
                }
            ],
            addCateDialogVisible: false,
            addCateForm: {
                cat_name: '',
                cat_level: 0,
                cat_pid: 0
            },
            addCateRule: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入类别名称',
                        trigger: 'blur'
                    }
                ]
            },
            parentCateList: [],
            cascaderProps: {
                children: 'children',
                value: 'cat_id',
                label: 'cat_name',
                expandTrigger: 'hover',
                checkStrictly: true
            },
            // 选中的父级id列表
            selectedKey: []
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取分类列表
        async getCateList() {
            const { data: res } = await this.$http.get('categories/', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.cateList = res.data.result
                this.total = res.data.total
            }
        },
        editCategory(id) {},
        deleteCategory(id) {},
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        showAddCateDialog() {
            this.getParList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类列表
        async getParList() {
            const { data: res } = await this.$http.get('categories/', {
                params: {
                    type: 2
                }
            })
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                console.log(res)
                this.parentCateList = res.data
            }
        },
        // 选择项发生改变
        parentCateChanged() {
            console.log(this.selectedKey)
            if (this.selectedKey.length > 0) {
                this.addCateForm.cat_pid = this.selectedKey[
                    this.selectedKey.length - 1
                ]
                this.addCateForm.cat_level = this.selectedKey.length
            } else {
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            }
        },
        addCate() {
            // - 请求路径：categories
            // - 请求方法：post
            console.log(this.addCateForm)
            this.$refs.addCateFormRef.validate(async valid => {
                if (valid) {
                    const { data: res } = await this.$http.post(
                        'categories',
                        this.addCateForm
                    )
                    if (res.meta.status !== 201) {
                        this.$message.error(res.meta.msg)
                    } else {
                        this.$message.success(res.meta.msg)
                        this.getCateList()
                    }
                }
            })
        },
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKey = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_name = ''
            this.addCateForm.cat_pid = 0
        }
    }
}
</script>

<style lang="less">
.zk-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}

.el-cascader-panel {
  height: 200px;
}
</style>
