Page({
  data: {
    markdownText: '',
    plainText: '',
    showHelpModal: false,
    lastConverted: '' // 用于存储上次转换的文本
  },

  onInput(e) {
    this.setData({
      markdownText: e.detail.value
    });
  },

  clearInput() {
    this.setData({
      markdownText: '',
      plainText: ''
    });
  },

  // 检查是否需要重新转换
  checkNeedConvert() {
    return this.data.markdownText !== this.data.lastConverted;
  },

  convertToPlainText() {
    if (!this.data.markdownText.trim()) {
      wx.showToast({
        title: '请输入Markdown文本',
        icon: 'none'
      });
      return;
    }

    // 如果文本没有改变，不需要重新转换
    if (!this.checkNeedConvert()) {
      return;
    }

    let text = this.data.markdownText;
    
    // 转换标题
    text = text.replace(/#{1,6}\s+/g, '');
    
    // 转换加粗斜体（需要在单独的粗体和斜体之前处理）
    text = text.replace(/(\*\*\*|___)(.*?)\1/g, '$2');
    
    // 转换粗体和斜体
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');
    
    // 转换删除线
    text = text.replace(/~~(.*?)~~/g, '$1');
    
    // 转换下划线（HTML标签形式）
    text = text.replace(/<u>(.*?)<\/u>/g, '$1');
    
    // 转换背景高亮（==标记或HTML标签形式）
    text = text.replace(/==(.*?)==/g, '$1');
    text = text.replace(/<mark>(.*?)<\/mark>/g, '$1');
    
    // 转换链接
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    
    // 转换脚注引用
    text = text.replace(/\[\^([^\]]+)\]/g, '');  // 移除脚注引用标记
    text = text.replace(/\[\^([^\]]+)\]:\s*([\s\S]+?)(?=\n\s*\n|\n\[\^|$)/g, '');  // 移除脚注内容
    
    // 转换引用（处理多层引用）
    text = text.replace(/^[>\s]*>+\s*/gm, '');
    
    // 转换列表（支持多层嵌套）
    text = text.replace(/^[\s]*[\*\-\+]\s+/gm, '');  // 无序列表（支持缩进）
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');     // 有序列表（支持缩进）
    
    // 转换代码块
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // 转换水平线（重写处理逻辑）
    let lines = text.split('\n');
    lines = lines.filter(line => {
      // 检查是否为水平线（3个或更多的 -、* 或 _）
      const isHorizontalLine = /^[\s]*[-*_]{3,}[\s]*$/.test(line);
      return !isHorizontalLine;
    });
    text = lines.join('\n');
    
    // 清理多余的空行
    text = text.replace(/\n{3,}/g, '\n\n');
    
    this.setData({
      plainText: text.trim(),
      lastConverted: this.data.markdownText
    });

    wx.vibrateShort(); // 添加触感反馈
  },

  copyText() {
    if (!this.data.plainText) {
      wx.showToast({
        title: '没有可复制的内容',
        icon: 'none'
      });
      return;
    }
    wx.setClipboardData({
      data: this.data.plainText,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
        wx.vibrateShort(); // 添加触感反馈
      }
    });
  },

  copyMarkdown() {
    if (!this.data.markdownText) {
      wx.showToast({
        title: '没有可复制的内容',
        icon: 'none'
      });
      return;
    }
    wx.setClipboardData({
      data: this.data.markdownText,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
        wx.vibrateShort(); // 添加触感反馈
      }
    });
  },

  showHelp() {
    this.setData({
      showHelpModal: true
    });
    wx.vibrateShort(); // 添加触感反馈
  },

  hideHelp() {
    this.setData({
      showHelpModal: false
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  }
}); 