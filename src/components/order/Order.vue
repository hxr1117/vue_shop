<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- k卡片式图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input
                        clearable
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        @clear="getOrderList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getOrderList"
                        ></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table style="width: 100%;" :data="orderList">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号">
                </el-table-column>
                <el-table-column
                    prop="order_price"
                    label="价格"
                ></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_pay === '1'"
                            >已付款</el-tag
                        >
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否发货"
                    prop="is_send"
                ></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
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
                            type="success"
                            icon="el-icon-location"
                            size="mini"
                            @click="showProgress(scope.row.order_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 50]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <el-dialog title="物流进度" :visible.sync="progressVisible" width="30%">
            <el-timeline :reverse="true">
                <el-timeline-item
                    v-for="(progress, index) in progressData"
                    :key="index"
                    :timestamp="progress.time"
                >
                    {{ progress.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
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
            total: 0,
            orderList: [],
            progressVisible: false,
            progressData: []
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            console.log(this.queryInfo)
            const { data: res } = await this.$http.get('/orders', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                console.log(res.data)
                this.total = res.data.total
                this.orderList = res.data.goods
            }
        },
        async showProgress(id) {
            // - 请求路径：/kuaidi/:id
            // - 请求方法：get
            const { data: res } = await this.$http.get('/kuaidi/1106975712662')
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.progressData = res.data
            }
            this.progressVisible = true
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        }
    }
}
</script>

<style lang="less" scoped></style>
