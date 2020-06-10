<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片式图 -->
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false"
            >
            </el-alert>
            <el-steps :active="active - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-position="top"
            >
                <!-- 左侧tab栏 -->
                <el-tabs
                    :tab-position="'left'"
                    v-model="active"
                    :before-leave="beforeTabLeave"
                    @tab-click="tabClick"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input
                                v-model="addForm.goods_price"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input
                                v-model="addForm.goods_weight"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input
                                v-model="addForm.goods_number"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cateProps"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item
                            v-for="(item, i) in manyTableData"
                            :key="i"
                            :label="item.attr_name"
                        >
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox
                                    size="small"
                                    border
                                    v-for="(item, i) in item.attr_vals"
                                    :key="i"
                                    :label="item"
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in onlyTableData"
                            :key="item.attr_id"
                        >
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action: 上传的API接口 -->
                        <!-- upload组件包含了自己的axios接口，没有使用main.js里的axios -->
                        <el-upload
                            :action="upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headersObj"
                            :on-success="handleSuccess"
                        >
                            <el-button size="small" type="primary"
                                >点击上传</el-button
                            >
                            <div slot="tip" class="el-upload__tip">
                                只能上传jpg/png文件，且不超过500kb
                            </div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <el-button type="primary" class="addBtn" @click="add"
                            >添加商品</el-button
                        >
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="dialogVisible" width="30%">
            <img :src="previewPath" alt="" class="previewImg" />
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            active: '0',
            addForm: {
                goods_name: '',
                goods_cat: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                goods_introduce: '',
                pics: [],
                attrs: []
            },
            addFormRules: {
                goods_name: [
                    {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }
                ],
                goods_price: [
                    {
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }
                ],
                goods_weight: [
                    {
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    }
                ],
                goods_number: [
                    {
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }
                ],
                goods_cat: [
                    {
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }
                ]
            },
            cateList: [],
            cateProps: {
                label: 'cat_name',
                children: 'children',
                value: 'cat_id'
            },
            manyTableData: [],
            onlyTableData: [],
            // 后台上传地址
            upload: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传的头信息对象
            headersObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewPath: '',
            dialogVisible: false
        }
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                console.log(res)
                this.cateList = res.data
            }
        },
        handleChange() {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },
        beforeTabLeave(activeName, oldName) {},
        async getParams(sel) {
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {
                    params: { sel: sel }
                }
            )
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                console.log(res.data)
                if (sel === 'many') {
                    res.data.forEach(item => {
                        item.attr_vals =
                            item.attr_vals === ''
                                ? []
                                : item.attr_vals.split(' ')
                    })
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
            }
        },
        tabClick() {
            if (this.active === '1') {
                this.getParams('many')
            } else if (this.active === '2') {
                this.getParams('only')
            }
        },
        // 处理图片预览
        handlePreview(file) {
            this.previewPath = file.response.data.url
            this.dialogVisible = true
        },
        // 处理图片删除
        handleRemove(file) {
            // 获取要删除的临时路径
            // 获取索引
            // 删除
            const filePath = file.response.data.tmp_path
            const index = this.addForm.pics.findIndex(
                item => item.pic === filePath
            )
            this.addForm.pics.splice(index, 1)
            console.log(this.addForm)
        },
        // 图片上传成功
        handleSuccess(response) {
            // 拼接成图片信息对象（服务器要求规则
            const picInfo = { pic: response.data.tmp_path }
            this.addForm.pics.push(picInfo)
            console.log(this.addForm)
        },
        add() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    this.$message.error('请填写必填的项目')
                } else {
                    // 因为级联选择器绑定的数据对象一定要是数组，而后台需要的数据是字符串，所以需要进行深拷贝
                    // lodash包里的cloneDeep()
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // 处理attrs(商品的参数（数组），包含 动态参数 和 静态属性)
                    // 处理动态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ') || ''
                        }
                        form.attrs.push(newInfo)
                    })
                    // 处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ') || ''
                        }
                        form.attrs.push(newInfo)
                    })
                    form.goods_name = form.goods_name.trim()
                    console.log(form)
                    // - 请求路径：goods
                    // - 请求方法：post
                    // 商品名称必须唯一
                    const { data: res } = await this.$http.post('goods', form)
                    if (res.meta.status !== 201) {
                        this.$message.error(res.meta.msg)
                    } else {
                        this.$message.success(res.meta.msg)
                        this.$router.push('/goods')
                    }
                }
            })
        }
    },
    created() {
        this.getCateList()
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
            } else {
                return null
            }
        }
    }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;

  .el-step__title {
    font-size: 14px;
  }
}

.el-tabs {
  margin-top: 15px;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.el-tab-pane .addBtn {
  margin-top: 15px;
}
</style>
