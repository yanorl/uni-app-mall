<template>
	<view class="cart-box">
		<!-- 购物列表 -->
		<view class="goods-list">
			<view class="empty" v-if="goodsList.length == 0">老鼠都不来的购物车！</view>
			<view class="row" v-for="(item, index) in goodsList" :key="index">
				<!-- 删除按钮 -->
				<view class="menu" @tap="handleSingleDelete(item)"><view class="icon iconfont">&#xe6a6;</view></view>
				<!-- 商品 -->
				<view
					class="production"
					@touchstart="handleTouchStar(index, $event)"
					@touchmove="handleTouchMove(index, $event)"
					@touchend="handleTouchEnd(index, $event)"
					:class="[currentIndex == index ? 'open' : oldIndex == index ? 'close' : '']"
				>
					<!-- checkbox -->
					<view class="container" @tap="handleCheckbox(item)">
						<view class="checkbox"><view :class="{ on: item.selected }"></view></view>
					</view>

					<!-- 商品详情 -->
					<view class="goods-info">
						<view class="img"><image :src="item.img"></image></view>
						<view class="info">
							<view class="title" @tap="handleGoodsInfo(item)">{{ item.name }}</view>
							<view class="spec">{{ item.spec }}</view>
							<view class="price-number">
								<view class="price">￥{{ item.price }}</view>
								<counter :goodsInfo="item" @add="add(item)" @sub="sub(item)" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部菜单 -->
		<view class="footer" :style="{ bottom: footerbottom }">
			<!-- checkbox -->
			<view class="container" @tap="handleSelectedAll">
				<view class="checkbox"><view :class="{ on: isAllSelected }"></view></view>
				<view class="text">全选</view>
			</view>
			<view class="delBtn" @tap="handleMulDelete" v-if="selectedList.length > 0">删除</view>
			<view class="settlement">
				<view class="sum">
					合计:
					<view class="money">￥{{ sumPrice }}</view>
				</view>
				<view class="btn" @tap="handleConfirm">结算{{ selectedList.length }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import counter from '../../../components/counter/counter.vue';
export default {
	data() {
		return {
			goodsList: [],
			currentIndex: null, //控制滑动效果，当前滑动下标
			oldIndex: null, //上一个左滑下标
			footerbottom: 0,
			selectedList: [],
			isAllSelected: false,
			sumPrice: '0.00'
		};
	},
	onLoad() {
		// 兼容h5下的底部菜单
		// #ifdef H5
		this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight + 'px';
		// #endif
	},
	onShow() {
		uni.getStorage({
			key: 'goodsList',
			success: res => {
				//将所有商品到选中状态都设置为false
				for (let i = 0; i < res.data.length; i++) {
					res.data[i].selected = false;
				}
				this.goodsList = res.data;
				// console.log(this.goodsList);
				// 属性数据的初始化
				this.selectedList = [];
				this.isAllSelected = false;
				this.sumPrice = '0.00';
			}
		});
	},
	comments: {
		counter
	},
	methods: {
		handleCheckbox(item) {
			// 单选
			item.selected = !item.selected;
			// 条件: 数组中是否包含该元素
			let isExist = this.selectedList.indexOf(item);
			if (isExist > -1) {
				this.selectedList.splice(isExist, 1);
			} else {
				// push 数组里
				this.selectedList.push(item);
			}
			// 全选状态
			if (this.selectedList.length == this.goodsList.length) {
				this.isAllSelected = true;
			} else {
				this.isAllSelected = false;
			}
			this.sum();
		},
		handleSelectedAll() {
			// 全选
			this.isAllSelected = !this.isAllSelected;
			// 数据处理
			let arr = [];
			this.goodsList.forEach((item, i) => {
				item.selected = this.isAllSelected;
				arr.push(item);
			});
			this.selectedList = this.isAllSelected ? arr : [];
			// 调用合计
			this.sum();
		},
		handleGoodsInfo(item) {
			uni.navigateTo({
				url: '../../goods/goods?goodsInfo=' + JSON.stringify(item)
			});
		},
		handleTouchStar(index, e) {
			// console.log(e);
			//多点触控，不触发
			if (e.touches.length > 1) {
				return;
			}

			this.oldIndex = this.currentIndex;
			this.currentIndex = null;

			//初始化
			this.initXY = [e.touches[0].pageX, e.touches[0].pageY];
		},
		handleTouchMove(index, e) {
			// console.log('move');
			if (e.touches.length > 1) {
				return;
			}
			//移动位置
			let moveX = e.touches[0].pageX - this.initXY[0];
			let moveY = e.touches[0].pageY - this.initXY[1];
			//左滑
			if (moveX < 0) {
				this.currentIndex = index;
			} else {
				//右滑
				// this.oldIndex = this.currentIndex;
				// this.currentIndex = null;
			}
			//滑动距离小，不触发
			if (Math.abs(moveX) < 5) {
				return;
			}
			//竖向滑动，不触发
			if (Math.abs(moveY) > Math.abs(moveX)) {
				return;
			}
		},
		handleTouchEnd(index, e) {
			console.log('end');
		},
		sum() {
			//合计
			this.sumPrice = 0;
			this.goodsList.forEach(item => {
				if (item.selected) {
					this.sumPrice = this.sumPrice + item.number * item.price;
				}
			});
			this.sumPrice = this.sumPrice.toFixed(2);
		},
		handleSingleDelete(item) {
			// 更新storage
			uni.getStorage({
				key: 'goodsList',
				success: res => {
					let goodsList = res.data;
					// 本地删除选中商品
					goodsList.forEach((goods, index) => {
						if (goods.goods_id == item.goods_id) {
							goodsList.splice(index, 1);
						}
					});
					uni.setStorageSync('goodsList', goodsList);
				}
			});

			// 更新数组
			this.goodsList.splice(this.goodsList.indexOf(item), 1);
			this.selectedList.splice(this.selectedList.indexOf(item), 1);

			// 全部删除取消全选状态
			this.isAllSelected = this.goodsList.length > 0 ? this.isAllSelected : false;
			this.sum();
			this.oldIndex = null;
			this.theIndex = null;
		},
		handleMulDelete() {
			// 循环删除所有选中的商品
			while (this.selectedList.length > 0) {
				this.handleSingleDelete(this.selectedList[0]);
			}

			// 初始化数据
			this.selectedList = [];
			this.isAllSelected = false;
			this.sum();
		},
		add(item) {
			item.number++;
			// console.log(this.goodsList)
			// 更新storage
			uni.getStorage({
				key: 'goodsList',
				success: res => {
					uni.setStorageSync('goodsList', this.goodsList);
				}
			});
			this.sum();
		},
		sub(item) {
			if (item.number <= 1) {
				return;
			}
			item.number--;
			// 更新storage
			uni.getStorage({
				key: 'goodsList',
				success: res => {
					uni.setStorageSync('goodsList', this.goodsList);
				}
			});
			this.sum();
		},
		handleConfirm() {
			// 结算
			if (this.selectedList.length < 1) {
				uni.showToast({
					title: '请选择结算的商品',
					icon: 'none'
				});
				return;
			}

			// 本地存储
			uni.setStorage({
				key: 'confirmList',
				data: this.selectedList,
				success: () => {
					uni.navigateTo({
						url: '../../order/order'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.container {
	display: flex;
	align-items: center;

	.checkbox {
		width: 35rpx;
		height: 35rpx;
		border-radius: 100%;
		border: solid 2rpx #f06c7a;
		display: flex;
		justify-content: center;
		align-items: center;

		.on {
			width: 25rpx;
			height: 25rpx;
			border-radius: 100%;
			background-color: #f06c7a;
		}
	}

	.text {
		font-size: 28rpx;
		margin-left: 10rpx;
	}
}

.goods-list {
	width: 100%;
	padding: 20rpx 0 120rpx 0;

	.empty {
		width: 100%;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #a7a7a7;
	}

	.row {
		width: calc(92%);
		height: calc(22vw + 40rpx);
		margin: 20rpx auto;

		border-radius: 15rpx;
		box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;

		.menu {
			.icon {
				color: #fff;
				font-size: 60rpx;
			}

			position: absolute;
			width: 30%;
			height: 100%;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: red;
			color: #fff;
			z-index: 2;
		}

		.production {
			@keyframes showMenu {
				0% {
					transform: translateX(0);
				}

				100% {
					transform: translateX(-30%);
				}
			}

			@keyframes closeMenu {
				0% {
					transform: translateX(-30%);
				}

				100% {
					transform: translateX(0);
				}
			}

			&.open {
				animation: showMenu 0.25s linear both;
			}

			&.close {
				animation: closeMenu 0.15s linear both;
			}

			background-color: #fff;

			.container {
				padding-left: 20rpx;
				flex-shrink: 0;
				height: 22vw;
				margin-right: 20rpx;
			}

			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			align-items: center;

			.goods-info {
				width: 100%;
				display: flex;
				padding-right: 20rpx;

				.img {
					width: 22vw;
					height: 22vw;
					border-radius: 10rpx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 10rpx;

					image {
						width: 22vw;
						height: 22vw;
					}
				}

				.info {
					width: 100%;
					height: 22vw;
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					position: relative;

					.title {
						width: 100%;
						font-size: 28rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						// text-align: justify;
						overflow: hidden;
					}

					.spec {
						font-size: 20rpx;
						background-color: #f3f3f3;
						color: #a7a7a7;
						height: 30rpx;
						display: flex;
						align-items: center;
						padding: 0 10rpx;
						border-radius: 15rpx;
						margin-bottom: 20vw;
					}

					.price-number {
						position: absolute;
						width: 100%;
						bottom: 0rpx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						font-size: 28rpx;
						height: 60rpx;

						.price {
						}
					}
				}
			}
		}
	}
}

.footer {
	width: 92%;
	padding: 0 4%;
	background-color: #fbfbfb;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28rpx;
	position: fixed;
	bottom: 0rpx;
	z-index: 5;

	.delBtn {
		border: solid 1rpx #f06c7a;
		color: #f06c7a;
		padding: 0 30rpx;
		height: 50rpx;
		border-radius: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.settlement {
		width: 60%;
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.sum {
			width: 50%;
			font-size: 28rpx;
			margin-right: 10rpx;
			display: flex;
			justify-content: flex-end;

			.money {
				font-weight: 600;
			}
		}

		.btn {
			padding: 0 30rpx;
			height: 50rpx;
			background-color: #f06c7a;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;

			border-radius: 30rpx;
		}
	}
}
</style>
