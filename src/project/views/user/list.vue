<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width: 95%; margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%; margin: 10px auto">
        <el-button icon="el-icon-plus" type="primary" @click="toCreate"
          >新建</el-button
        >
<!--        <el-button icon="el-icon-delete" @click="batchDelete">删除</el-button>  -->
        <el-dropdown
          :trigger="'click'"
          @command="handleClick"
          size="medium"
          @visible-change="onMenuChange"
        >
 <!--         <el-button
            icon="el-icon-menu"
            style="background: #3e5265; color: white"
            >更多操作<i
              :class="
                menu.visible ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
              "
            ></i
          ></el-button>    -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-circle-check"
              command="启用"
              :disabled="
                selectList.findIndex(s => {
                  return s.status === '启用';
                }) >= 0 || selectList.length === 0
              "
              :style="
                selectList.findIndex(s => {
                  return s.status === '启用';
                }) >= 0 || selectList.length === 0
                  ? { color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' }
                  : { color: '#fff' }
              "
              @click="batchEnable"
            >
              启用
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-circle-close"
              command="禁用"
              :disabled="
                selectList.findIndex(s => {
                  return s.status === '禁用';
                }) >= 0 || selectList.length === 0
              "
              :style="
                selectList.findIndex(s => {
                  return s.status === '禁用';
                }) >= 0 || selectList.length === 0
                  ? { color: 'rgba(255,255,255,0.4)' }
                  : { color: '#fff' }
              "
              @click.stop="batchDisable"
            >
              禁用
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-edit"
              command="编辑"
              :disabled="selectList.length !== 1"
              :style="
                selectList.length !== 1
                  ? { color: 'rgba(255,255,255,0.4)' }
                  : { color: '#fff' }
              "
              @click.stop="handleEdit"
            >
              编辑
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="pager-group">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, jumper, prev, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 95%; margin: 0 auto"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="userName" label="昵称">
          <!-- <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small">
              {{scope.row.nickname}}
            </el-button>
          </template> -->
        </el-table-column>

        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="creatTime" label="创建时间" sortable>
        </el-table-column>
        <el-table-column prop="balance" label="余额"> </el-table-column>

        <el-table-column prop="level" label="会员等级"> </el-table-column>

        <!-- <el-table-column prop="status" label="状态"> </el-table-column> -->

        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <!-- <el-button
              @click.stop="handleStatusChange(scope.row)"
              type="text"
              size="small"
              >{{
                scope.row.status.indexOf("启用") >= 0 ? "禁用" : "启用"
              }}</el-button
            > -->
            <el-button @click="toReduce(scope.row)" type="text" size="small">{{
              "扣费"
            }}</el-button>


            <el-button
              @click="toRecharge(scope.row)"
              type="text"
              size="small"
              >{{ "充值" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />

    <!-- 扣费 -->
    <i-reduce
      :dialog-visible="reduceProps.visible"
      :id="reduceId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />

    <!-- 充值 -->
    <i-recharge
      :dialog-visible="rechargeProps.visible"
      :id="rechargeId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />

    <!--    &lt;!&ndash;    编辑&ndash;&gt;-->
    <!--    <i-edit-->
    <!--      :dialog-visible="editProps.visible"-->
    <!--      :edit-id="editId"-->
    <!--      @on-dialog-close="handleClose"-->
    <!--    />-->
  </el-row>
</template>
<script>
import Search from "@/framework/components/search";
import ICreate from "./create";
import IReduce from "./reduce";
import IRecharge from "./recharge";
// import IEdit from "./edit"
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import { search, count, del, enable, disable } from "./user-service";

export default {
  mixins: [Emitter],
  data() {
    return {
      model: "userQueryDTO",
      createProps: {
        visible: false
      },
      editProps: {
        visible: false
      },
      reduceProps: {
        visible: false
      },
      rechargeProps: {
        visible: false
      },
      menu: {
        visible: false
      },
      editId: 0, //编辑id
      reduceId: 0,
      rechargeId: 0,
      data: [],
      selectList: [],
      sort: { asc: [], desc: [] },
      pageSize: 10,
      page: 1,
      total: 0,
      extraParam: {},
      searchItems: [
        {
          name: "手机号",
          key: "phone",
          type: "string"
        },
        // {
        //   name: "最近登录时间",
        //   key: "accessAt",
        //   type: "daterange",
        // },
        {
          name: "名字",
          key: "userName",
          type: "string"
          // displayValue: ["禁用", "启用"],
          // value: ["禁用", "启用"]
        }
      ]
    };
  },
  computed: {
    route() {
      return this.$route;
    }
  },
  components: {
    Search,
    ICreate,
    IReduce,
    IRecharge
  },
  methods: {
    handleEdit() {
      //不知道这里是用id还是userId
      this.editId = this.selectList[0].userId;
      this.editProps.visible = true;
    },
    handleStatusChange(row) {
      let status;
      let _t = this;
      if (row.status.indexOf("启用") >= 0) {
        status = "禁用";
      } else {
        status = "启用";
      }
      this.$confirm(`确定${status}选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (status === "禁用") {
            disable({ id: row.userId }, res => {
              _t.$message({
                type: "success",
                message: "已禁用!"
              });
              _t.search(_t.page);
            });
          } else {
            enable({ id: row.userId }, res => {
              _t.$message({
                type: "success",
                message: "已启用!"
              });
              _t.search(_t.page);
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search(1);
    },
    handlePageChange(page) {
      this.search(page);
    },
    handleSortChange(sort) {
      let key = sort.key;
      let order = sort.order;
      let asc = this.sort.asc;
      let desc = this.sort.desc;
      if (asc.indexOf(key) > -1) {
        let idx = asc.indexOf(key);
        asc.splice(idx, 1);
      }
      if (desc.indexOf(key) > -1) {
        let idx = desc.indexOf(key);
        desc.splice(idx, 1);
      }
      if (order !== "normal") {
        this.sort[order].push(key);
      }
      this.search(1);
    },
    searchBySearchItem(searchItems) {
      let keys = [];
      for (
        let i = 0,
          searchItemList = this.searchItems,
          len = searchItemList.length;
        i < len;
        i++
      ) {
        keys.push(searchItemList[i].key);
      }
      for (let i in keys) {
        if (searchItems[keys[i]]) {
          this.extraParam[keys[i]] = searchItems[keys[i]];
        } else {
          delete this.extraParam[keys[i]];
        }
      }
      this.search(1);
    },
    toCreate() {
      //       console.log("sadasd")
      this.createProps.visible = true;
    },
    toReduce(row) {
      console.log(row.userId);
      this.reduceId = row.userId;
      this.reduceProps.visible = true;
    },
    toRecharge(row) {
      console.log(row.userId)
      this.rechargeId = row.userId;
      this.rechargeProps.visible = true;
    },
    search(page) {
      let _t = this;
      _t.extraParam.page = page;
      _t.extraParam.size = _t.pageSize;
      _t.extraParam.sort = "id desc";
      let param = {
        // pageable: {
        //   page: page,
        //   size: _t.pageSize,
        //   sort: _t.sort
        // },
        [this.model]: _t.extraParam
      };
      // if (
      //   _t.sort.asc.length === 0 &&
      //   _t.sort.desc.length === 0
      // ) {
      //   delete param.pageable.sort;
      // }
      search(param, res => {
        let data = res.data.items;
        _t.data = data;
        _t.total = res.data.total;
        //          _t.getTotal();
        _t.setValue(data);
      });
    },
    setValue(data) {
      for (let i in data) {
        let _status = data[i].status;
        let _level = data[i].level;
        data[i].balance = data[i].balance + "元";
        if (_status === "0") {
          data[i].status = "启用";
        } else {
          data[i].status = "禁用";
        }

        if (_level == "low") {
          data[i].level = "初级";
        } else if (_level == "middle") {
          data[i].level = "中级";
        } else if (_level == "high") {
          data[i].level = "高级";
        }else {
          data[i].level = "非会员";
        }
      }
    },
    getTotal() {
      let _t = this;
      let param = { [this.model]: _t.extraParam };
      count(param, res => {
        _t.total = parseInt(res);
      });
    },
    handleTransportSelectList(list) {
      this.selectList = list;
    },
    //批量删除
    batchDelete() {
      this.broadcast("SiTable", "on-get-selectList");
      this.$nextTick(() => {
        let selectList = this.selectList;
        if (selectList.length === 0) {
          this.$notify.warning({
            title: "至少选择一条数据"
          });
          return;
        }
        this.$confirm("确定删除所选记录吗?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            del({ ids: ids }, res => {
              _t.search(_t.page);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      });
    },
    //批量启用
    batchEnable() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定启用所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          selectList.map(s => {
            enable({ id: s.userId }, res => {
              _t.search(_t.page);
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //批量禁用
    batchDisable() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定启用所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          selectList.map(s => {
            disable({ id: s.userId }, res => {
              _t.search(_t.page);
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    delete(id) {
      let _t = this;
      del({ id: id }, res => {
        _t.search(_t.page);
      });
    },
    enable(id, url) {
      let _t = this;
      post(url, { id: id }, res => {
        _t.search(_t.page);
      });
    },
    handleClose() {
      this.createProps.visible = false;
      this.editProps.visible = false;
      this.reduceProps.visible = false;
      this.rechargeProps.visible = false;
    },
    handleSave() {
      this.createProps.visible = false;
      this.editProps.visible = false;
      this.reduceProps.visible = false;
      this.rechargeProps.visible = false;
      this.search(this.page);
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {
      console.log(row);
      this.editId = row.userId;
      this.editProps.visible = true;
    },
    toDetail(row) {
      this.$router.push({ path: `/${this.model}/show/` + row.userId });
    },

    handleCurrentChange(val) {
      this.page = val;
      this.search(this.page);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;

      this.search(this.page);
    },
    onMenuChange(val) {
      console.log(val);
    },
    handleClick(command) {
      switch (command) {
        case "编辑":
          console.log("编辑");
          this.editId = this.selectList[0].id;
          this.editProps.visible = true;
          break;
        case "启用":
          console.log("启用");
          this.batchEnable();
          break;
        case "禁用":
          console.log("禁用");
          this.batchDisable();
          break;
      }
    }
  },
  mounted() {
    this.search(1);
    // this.findAllRoles();
  }
};
</script>
<style lang="less" scoped>
.page {
  overflow-y: auto;
  overflow-x: hidden;
}
.el-button + .el-button {
  margin-left: 2px;
}
.el-button--default:hover {
  color: #00a16c;
  border: 1px solid#00a16c;
  background: white;
}
.footor {
  margin: 10px 30px;
  width: 90%;
  text-align: right;
}
</style>
