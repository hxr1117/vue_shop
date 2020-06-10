<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索框/添加按钮 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        clearable
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        @clear="getGoodsList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getGoodsList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表 -->
            <el-table :data="goodsList">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" width="500">
                </el-table-column>
                <el-table-column prop="goods_price" label="商品价格/元">
                </el-table-column>
                <el-table-column
                    prop="goods_number"
                    label="数量"
                ></el-table-column>
                <el-table-column prop="add_time" label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteGoods(scope.row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            goodsList: [],
            total: 0
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            }
            this.total = res.data.total
            this.goodsList = res.data.goods
        },
        async deleteGoods(id) {
            // - 请求路径：goods/:id
            // - 请求方法：delete
            const { data: res } = await this.$http.delete(`goods/${id}`)
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.$message.success(res.meta.msg)
                this.getGoodsList()
            }
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        goAddPage() {
            this.$router.push('/goods/add')
        }
    }
}
</script>

<style lang="less" scoped></style>
