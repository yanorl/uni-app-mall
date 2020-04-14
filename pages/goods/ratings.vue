<template>
	<view>
		<video v-show="showVideo" class="myVideo" id="myVideo" @fullscreenchange="videoControl" :src="videoSrc" @pause="videoPause"></video>

		<view class="content">
			<!-- 好中差评 -->
			<view class="label">
				<view @tap="loadRatings(index)" :class="{ on: index == labelIndex }" v-for="(label, index) in labelList" :key="index">{{ label.name }}({{ label.number }})</view>
			</view>
			<!-- 评论信息 -->
			<view class="list">
				<view class="ratings" v-for="(item, index) in ratingsList" :key="index">
					<view class="left">
						<view class="face"><image :src="item.face"></image></view>
					</view>
					<view class="right">
						<!-- username & date -->
						<view class="name-date">
							<view class="username">{{ item.username }}</view>
							<view class="date">{{ item.date }}</view>
						</view>
						<!-- specifications -->
						<view class="spec">{{ item.spec }}</view>
						<!-- medias -->
						<view class="medias">
							<view class="content">{{ item.content }}</view>
							<view class="img-video">
								<view @tap="playVideo(video.path)" class="box" v-for="video in item.video" :key="video.path">
									<image mode="aspectFill" :src="video.img"></image>
									<view class="playbtn"><view class="icon iconfont">&#xe7e9;</view></view>
								</view>
								<!-- 图片 -->
								<view @tap="showBigImg(image, item.img)" class="box" v-for="(image, index) in item.img" :key="index"><image mode="aspectFill" :src="image"></image></view>
							</view>
						</view>

						<!-- 点赞 -->
						<view class="movie-oper" :data-gIndex="index" @click="praiseMe">
							<image src="../../static/img/goods/praise.png" class="praise-ico"></image>
							<view class="praise-me">点赞</view>
							<view :animation="animationDataArr[index]" class="praise-me animation-opacity">+1</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showVideo: true,
			labelIndex: 0,
			ratingsList: [],
			labelList: [
				{
					name: '全部',
					number: 50,
					type: 'all'
				},
				{
					name: '好评',
					number: 25,
					type: 'good'
				},
				{
					name: '中评',
					number: 8,
					type: 'secondary'
				},
				{
					name: '差评',
					number: 1,
					type: 'poor'
				},
				{
					name: '有图',
					number: 12,
					type: 'img'
				},
				{
					name: '视频',
					number: 2,
					type: 'video'
				},
				{
					name: '追加',
					number: 2,
					type: 'append'
				}
			],
			videoSrc: '',
			videoContext: null,
			animationDataArr: [],
			animationData: {}
		};
	},
	onLoad() {
		try {
			const comments = uni.getStorageSync('comments');
			if (comments) {
				this.ratingsList = comments;
			}
		} catch (e) {
			console.log(e);
		}
		this.showVideo = false;
		
		// #ifdef APP-PLUS || MP-WEIXIN
		// 在页面创建的时候，创建一个临时动画对象
		this.animation = uni.createAnimation();
		// #endif
		
	},
	onUnload() {
		// 页面卸载的时候，清除动画数据
		this.animationData = {};
		this.animationDataArr = [];
	},
	onReady() {
		this.videoContext = uni.createVideoContext('myVideo');
	},
	methods: {
		loadRatings(index) {
			this.labelIndex = index;
		},
		showBigImg(image, images) {
			uni.previewImage({
				current: image,
				urls: images
			});
		},
		playVideo(path) {
			this.videoSrc = path;

			//全屏播放
			this.$nextTick(function() {
				this.videoContext.requestFullScreen({
					direction: 0
				});
			});
		},
		videoControl(e) {
			if (e.detail.fullScreen) {
				// 全屏
				// 自动播放
				this.videoContext.play();
			} else {
				// 停止播放
				this.videoContext.stop();
				this.videoPause();
			}
		},
		videoPause() {
			this.videoSrc = '';
			// #ifdef MP
			this.showVideo = false;
			// #endif
		},
		// 实现点赞动画效果
		praiseMe(e) {
			// #ifdef APP-PLUS || MP-WEIXIN
			var gIndex = e.currentTarget.dataset.gindex;
			console.log(gIndex);
			// return;
			// 构建动画数据，并且通过step来表示这组动画的完成
			this.animation
				.translateY(-60)
				.opacity(1)
				.step({
					duration: 400
				});

			// 导出动画数据到view组件，实现组件的动画效果
			// this.animationData = this.animation.export();
			this.animationData = this.animation;
			this.animationDataArr[gIndex] = this.animationData.export();

			// 还原动画
			setTimeout(
				function() {
					this.animation
						.translateY(0)
						.opacity(0)
						.step({
							duration: 0
						});
					this.animationData = this.animation;
					this.animationDataArr[gIndex] = this.animationData.export();
				}.bind(this),
				500
			);
			// #endif
		}
	}
};
</script>

<style lang="scss">
.content {
	view {
		display: flex;
	}

	width: 94%;
	padding: 0 3%;

	.label {
		width: 100%;
		flex-wrap: wrap;

		view {
			padding: 0 20upx;
			height: 50upx;
			border-radius: 40upx;
			border: solid 1upx #ddd;
			align-items: center;
			color: #555;
			font-size: 26upx;
			background-color: #f9f9f9;
			margin: 10upx 20upx 10upx 0;

			&.on {
				border: solid 1upx #f06c7a;
				color: #f06c7a;
			}
		}
	}
}

.list {
	width: 100%;
	flex-wrap: wrap;
	padding: 20upx 0;

	.ratings {
		width: 100%;
		margin-top: 30upx;

		.left {
			width: 10vw;
			flex-shrink: 0;
			margin-right: 10upx;

			.face {
				width: 100%;

				image {
					width: 10vw;
					height: 10vw;
					border-radius: 100%;
				}
			}
		}

		.right {
			width: 100%;
			flex-wrap: wrap;

			.name-date {
				width: 100%;
				justify-content: space-between;
				align-items: baseline;

				.username {
					font-size: 32upx;
					color: #555;
				}

				.date {
					font-size: 28upx;
					color: #aaa;
				}
			}

			.spec {
				width: 100%;
				color: #aaa;
				font-size: 26upx;
			}

			.medias {
				width: 100%;
				flex-wrap: wrap;

				.content {
					font-size: 30upx;
				}

				.img-video {
					width: 100%;
					flex-wrap: wrap;

					.box {
						width: calc((84.6vw - 50upx) / 4);
						height: calc((84.6vw - 50upx) / 4);
						margin: 5upx 5upx;
						position: relative;
						justify-content: center;
						align-items: center;

						image {
							position: absolute;
							width: 100%;
							height: 100%;
							border-radius: 10upx;
						}

						.playbtn {
							position: absolute;

							.icon {
								font-size: 80upx;
								color: rgba(255, 255, 255, 0.9);
							}
						}
					}
				}
			}
		}
	}
}
.myVideo {
	position: fixed;
	top: 50%;
	right: 100%;
	// #ifdef  MP
	top: 0;
	right: 0;
	z-index: 99;
	width: 100%;
	height: 100%;
	// #endif
}

/* 点赞css */
.movie-oper {
	width: 100%;
	display: flex;
	flex-direction: column;
	// justify-content: flex-end;
	margin-top: 20rpx;
}

.praise-ico {
	width: 40upx;
	height: 40upx;
	align-self: flex-end;
}

.praise-me {
	font-size: 14px;
	color: #feab2a;
	align-self: flex-end;
}

.animation-opacity {
	font-weight: bold;
	opacity: 0;
}
</style>
