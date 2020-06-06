<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片式图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table :data="rolesList">
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template scope="scope">
                        <el-row
                            v-for="(item1, i1) in scope.row.children"
                            :key="item1.id"
                            :class="[
                                'bdbottom',
                                'vcenter',
                                i1 === 0 ? 'bdtop' : ''
                            ]"
                        >
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag
                                    closable
                                    @close="
                                        removeRolesById(scope.row, item3.id)
                                    "
                                    >{{ item1.authName }}</el-tag
                                >
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二/三级权限 -->
                            <el-col :span="19">
                                <el-row
                                    v-for="(item2, i2) in item1.children"
                                    :key="item2.id"
                                    :class="[
                                        'vcenter',
                                        i2 === 0 ? '' : 'bdtop'
                                    ]"
                                >
                                    <!-- 通过for渲染二级权限 -->
                                    <el-col :span="6">
                                        <el-tag
                                            type="success"
                                            closable
                                            @close="
                                                removeRolesById(
                                                    scope.row,
                                                    item2.id
                                                )
                                            "
                                            >{{ item2.authName }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            type="warning"
                                            closable
                                            @close="
                                                removeRolesById(
                                                    scope.row,
                                                    item3.id
                                                )
                                            "
                                        >
                                            {{ item3.authName }}</el-tag
                                        >
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <pre></pre>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    label="角色名称"
                    prop="roleName"
                ></el-table-column>
                <el-table-column
                    label="角色描述"
                    prop="roleDesc"
                ></el-table-column>
                <el-table-column label="操作">
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
                        ></el-button>
                        <el-tooltip
                            effect="dark"
                            content="分配权限"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="showSetRightDialog(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="30%"
            @close="setRightDialogClosed"
        >
            <!-- 树形控件 -->
            <el-tree
                :data="rightsList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                :default-checked-keys="defaultKeys"
                default-expand-all
                ref="treeRef"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="editRight"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            setRightDialogVisible: false,
            rightsList: [],
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            defaultKeys: [],
            roleId: ''
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            // 请求路径：roles
            // 请求方法：get
            const { data: res } = await this.$http.get('roles/')
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.rolesList = res.data
            }
        },
        async removeRolesById(role, id) {
            // 请求路径：roles/:roleId/rights/:rightId
            const res = await this.$confirm(
                '此操作将永久删除该权限, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (res === 'confirm') {
                const { data: res } = await this.$http.delete(
                    `roles/${role.id}/rights/${id}`
                )
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                } else {
                    this.$message.success(res.meta.msg)
                    role.children = res.data
                }
            } else {
                this.$message.info('已取消删除')
            }
        },
        async showSetRightDialog(role) {
            this.roleId = role.id
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            } else {
                this.getLeafKeys(role, this.defaultKeys)
                this.setRightDialogVisible = true
                console.log(this.defaultKeys)
                this.rightsList = res.data
            }
        },
        async editRight() {
            // - 请求路径：roles/:roleId/rights
            // - 请求方法：post
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',')
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            if (res.meta.status !== 200) {
                console.log(res)
                this.$message.error(res.meta.msg)
            } else {
                this.$message.success(res.meta.msg)
                this.getRolesList()
                this.setRightDialogVisible = false
            }
        },
        // 递归获取三级权限id
        getLeafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            } else {
                node.children.forEach(item => {
                    return this.getLeafKeys(item, arr)
                })
            }
        },
        // 监视对话框关闭，清除勾选
        setRightDialogClosed() {
            this.defaultKeys = []
        }
    }
}
</script>

<style lang="less">
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
