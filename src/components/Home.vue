<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="" srcset="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">Logout</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="active"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        :index="'/' + item.path"
                        v-for="item in menulist"
                        :key="item.id"
                    >
                        <!-- 模版区 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="'/' + i.path"
                            v-for="i in item.children"
                            :key="i.id"
                            @click="activePath('/' + i.path)"
                        >
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <span>{{ i.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            isCollapse: false,
            menulist: [],
            iconObj: {
                103: 'iconfont el-icon-s-cooperation',
                125: 'iconfont el-icon-user-solid',
                101: 'iconfont el-icon-s-goods',
                102: 'iconfont el-icon-s-claim',
                145: 'iconfont el-icon-s-marketing'
            },
            active: ''
        }
    },
    created() {
        this.getMenuList()
        this.active = window.sessionStorage.getItem('path')
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            } else {
                console.log(res)
                this.menulist = res.data
                // return this.$message.success(res.meta.msg)
            }
        },
        // 侧边栏的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        activePath(path) {
            console.log(path)
            window.sessionStorage.setItem('path', path)
            this.activePath = path
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  img {
    border-radius: 50%;
    width: 50px;
  }

  > div {
    display: flex;
    align-items: center;

    > span {
      margin-left: 20px;
    }
  }
}

.el-aside {
  background-color: #333744;
  overflow: hidden;

  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  color: #fff;
  font-size: 10px;
  line-height: 30px;
  height: 30px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
