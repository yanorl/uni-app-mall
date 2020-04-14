<template>
	<view class="">
		<!-- 状态栏 -->
		<page-status></page-status>

		<goodsHeader />

		<!-- 轮播图 -->
		<view class="swiper-box">
			<swiper @change="swiperChange" circular="true" autoplay="true">
				<swiper-item v-for="swiper in goodsData.swiperList" :key="swiper.id"><image :src="swiper.img"></image></swiper-item>
			</swiper>
			<view class="indicator">{{ currentSwiper + 1 }}/{{ goodsData.swiperList.length }}</view>
		</view>

		<!-- 标题和价格 -->
		<view class="info-box goods-info">
			<view class="price">￥{{ goodsInfo.price }}</view>
			<view class="title">{{ goodsInfo.name }}</view>
		</view>

		<!-- 选择规格 -->
		<view class="info-box">
			<view class="row" @tap="spaceInfo.showSpace = true">
				<view class="text">选择</view>
				<view class="content">
					<view>选择规格:</view>
					<view class="sp">
						<view :class="{ on: item == goodsInfo.spec }" v-for="(item, index) in goodsData.spec" :key="index">{{ item }}</view>
					</view>
				</view>
				<!-- 箭头 -->
				<view class="arrow"><view class="icon iconfont">&#xe6a3;</view></view>
			</view>
		</view>

		<!-- 模态框 -->
		<popupSpec :spaceInfo="spaceInfo" :goodsInfo="goodsInfo" :goodsData="goodsData" @add="add" @sub="sub" @setSelectSpec="setSelectSpec" @hideSpec="hideSpec" />

		<!-- 评价 -->
		<view class="info-box comments">
			<view class="row">
				<view class="text">商品评价({{ goodsData.comment.length }})</view>
				<view class="arrow" @tap="handleRatings">
					<view class="show">
						查看全部
						<view class="icon iconfont">&#xe6a3;</view>
					</view>
				</view>
			</view>
			<view class="comment" @tap="handleRatings">
				<view class="user-info">
					<view class="face"><image :src="goodsData.comment[0].face"></image></view>
					<view class="username">{{ goodsData.comment[0].username }}</view>
				</view>
				<view class="content">{{ goodsData.comment[0].content }}</view>
			</view>
		</view>

		<!-- 商品详情 -->
		<view class="description">
			<view class="title">———— 商品详情 ————</view>
			<view class="content"><rich-text :nodes="goodsData.descriptionStr"></rich-text></view>
		</view>

		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box">
					<view class="icon iconfont">&#xe7e0;</view>
					<view class="text">分享</view>
				</view>
				<view class="box" @tap="keep">
					<view class="icon iconfont" v-if="isKeep">&#xe64b;</view>
					<view class="icon iconfont" v-else>&#xe64c;</view>
					<view class="text">{{ isKeep ? '已' : '' }}收藏</view>
				</view>
			</view>
			<view class="btn">
				<view @tap="joinCart" class="joinCart">加入购物车</view>
				<view @tap="handleBuy" class="buy">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
import goodsHeader from './goodsHeader.vue';
import popupSpec from '../../components/popupSpec/popupSpec.vue';
import interfaces from '../../utils/interfaces.js';

export default {
	data() {
		return {
			isKeep: false, // 收藏
			goodsData: {
				swiperList: [],
				spec: [],
				comment: [
					{
						face: '',
						content: '',
						username: ''
					}
				],
				descriptionStr: ''
			},
			goodsInfo: {
				name: '',
				price: '',
				number: 1,
				spec: ''
			},
			currentSwiper: 0, // 轮播图下标
			spaceInfo: {
				showSpace: false
			}
		};
	},
	onLoad(option) {
		if (!option.goodsInfo) {
			uni.switchTab({
				url: '../tabBar/category/category'
			});
			return;
		}
		this.goodsInfo = JSON.parse(option.goodsInfo);
		this.initData();
	},
	components: {
		goodsHeader,
		popupSpec
	},
	methods: {
		initData() {
			this.request({
				url: interfaces.getGoods,
				success: res => {
					this.goodsData = res.data;
				}
			});
		},
		swiperChange(event) {
			this.currentSwiper = event.detail.current;
		},
		setSelectSpec(item) {
			// 选择规格
			this.goodsInfo.spec = item;
		},
		hideSpec() {
			this.spaceInfo.showSpace = false;
		},
		add() {
			this.goodsInfo.number++;
		},
		sub() {
			if (this.goodsInfo.number <= 1) {
				return;
			}
			this.goodsInfo.number--;
		},
		handleRatings() {
			//本地存储
			uni.setStorageSync('comments', this.goodsData.comment);
			uni.navigateTo({
				url: './ratings'
			});
		},
		keep() {
			this.isKeep = !this.isKeep;
			if (this.isKeep) {
				uni.showToast({
					icon: 'success',
					title: '收藏成功'
				});
			} else {
				uni.showToast({
					icon: 'success',
					title: '取消收藏'
				});
			}
		},
		joinCart() {
			// console.log(this.goodsInfo)

			//存错到本地存储里
			//1.先去本地存储中取数据
			uni.getStorage({
				key: 'goodsList',
				success: res => {
					let goodsList = res.data;
					let isExist = false;
					goodsList.forEach(goods => {
						if (goods.goods_id == this.goodsInfo.goods_id && goods.spec == this.goodsInfo.spec) {
							// 如果存在  修改商品数量
							goods.number += Number(this.goodsInfo.number);
							isExist = true;
						}
					});
					if (!isExist) {
						// 不存在，存入数组
						goodsList.push(this.goodsInfo);
					}
					this.setGoodsList(goodsList);
				},
				fail: error => {
					//没有得到数据，那么就存数据
					let goodsList = [];
					goodsList.push(this.goodsInfo);
					//往本地存储数据
					this.setGoodsList(goodsList);
				}
			});
		},
		setGoodsList(goodsList) {
			//存储到本地存储中
			uni.setStorage({
				key: 'goodsList',
				data: goodsList,
				success: () => {
					uni.showToast({
						icon: 'success',
						title: '添加购物车成功'
					});
				}
			});
		},
		handleBuy() {
			let tempList = [];
			tempList.push(this.goodsInfo);
			uni.setStorage({
				key: 'confirmList',
				data: tempList,
				success: () => {
					uni.navigateTo({
						url: '../order/order'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
/*  修改状态栏样式 */
.status {
	/* #ifdef APP-PLUS */
	opacity: 0;
	/* #endif */
}

.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;

	swiper {
		width: 100%;
		height: 100vw;

		swiper-item {
			image {
				width: 100%;
				height: 100vw;
			}
		}
	}

	.indicator {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25rpx;
		height: 40rpx;
		border-radius: 40rpx;
		font-size: 22rpx;
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
}

.info-box {
	width: 92%;
	padding: 20rpx 4%;
	background-color: #fff;
	margin-bottom: 20rpx;
}

.goods-info {
	.price {
		font-size: 46rpx;
		font-weight: 600;
		color: #f47925;
	}

	.title {
		font-size: 30rpx;
	}
}

.row {
	width: 100%;
	display: flex;
	align-items: center;
	margin: 0 0 30rpx 0;

	.text {
		font-size: 28rpx;
		color: #a2a2a2;
		margin-right: 20rpx;
	}

	.content {
		font-size: 28rpx;
		display: flex;
		flex-wrap: wrap;

		.serviceitem {
			margin-right: 10rpx;
		}

		.sp {
			width: 100%;
			display: flex;

			view {
				background-color: #f6f6f6;
				padding: 10rpx;
				color: #999;
				margin-right: 10rpx;
				font-size: 20rpx;
				border-radius: 5rpx;

				&.on {
					border: solid 1rpx #f47952;
					padding: 4rpx 8rpx;
				}
			}
		}
	}

	.arrow {
		position: absolute;
		right: 4%;

		.icon {
			color: #ccc;
		}
	}
}

.comments {
	.row {
		width: 100%;
		height: 40rpx;
		display: flex;
		align-items: center;
		margin: 0 0 30rpx 0;

		.text {
			font-size: 30rpx;
		}

		.arrow {
			font-size: 28rpx;
			position: absolute;
			right: 4%;
			color: #17e6a1;

			.show {
				display: flex;
				align-items: center;

				.icon {
					color: #17e6a1;
				}
			}
		}
	}

	.comment {
		width: 100%;

		.user-info {
			width: 100%;
			height: 40rpx;
			display: flex;
			align-items: center;

			.face {
				width: 40rpx;
				height: 40rpx;
				margin-right: 8rpx;

				image {
					width: 40rpx;
					height: 40rpx;
					border-radius: 100%;
				}
			}

			.username {
				font-size: 24rpx;
				color: #999;
			}
		}

		.content {
			margin-top: 10rpx;
			font-size: 26rpx;
		}
	}
}

.description {
	.title {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #999;
	}
}

.footer {
	position: fixed;
	bottom: 0rpx;
	width: 92%;
	padding: 0 4%;
	height: 99rpx;
	border-top: solid 1rpx #eee;
	background-color: #fff;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.icons {
		display: flex;
		height: 80rpx;
		margin-left: -4%;

		.box {
			width: 80rpx;
			height: 80rpx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.icon {
				font-size: 40rpx;
				color: #828282;
			}

			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22rpx;
				color: #666;
			}
		}
	}

	.btn {
		height: 80rpx;
		border-radius: 40rpx;
		overflow: hidden;
		display: flex;
		margin-right: -2%;

		.joinCart,
		.buy {
			height: 80rpx;
			padding: 0 40rpx;
			color: #fff;
			display: flex;
			align-items: center;
			font-size: 28rpx;
		}

		.joinCart {
			background-color: #f0b46c;
		}

		.buy {
			background-color: #f06c7a;
		}
	}
}
</style>
