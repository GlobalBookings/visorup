/**
 * VisorUp Notifications — In-app notification system.
 * Stores notifications in localStorage with Supabase fallback pattern.
 */

var VisorUpNotifications = {

  _storageKey: 'vu_notifications',

  _getData: function() {
    try {
      var raw = localStorage.getItem(this._storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  _saveData: function(data) {
    try { localStorage.setItem(this._storageKey, JSON.stringify(data)); } catch (e) {}
  },

  add: function(notification) {
    var data = this._getData();
    var n = {
      id: notification.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      type: notification.type || 'info',
      message: notification.message || '',
      icon: notification.icon || 'fa-bell',
      link: notification.link || null,
      read: notification.read || false,
      createdAt: notification.createdAt || new Date().toISOString()
    };
    data.unshift(n);
    if (data.length > 100) data = data.slice(0, 100);
    this._saveData(data);
    this._updateBadge();
    return n;
  },

  getAll: function() {
    var data = this._getData();
    data.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return data;
  },

  getUnread: function() {
    return this.getAll().filter(function(n) { return !n.read; });
  },

  getUnreadCount: function() {
    return this.getUnread().length;
  },

  markRead: function(id) {
    var data = this._getData();
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) { data[i].read = true; break; }
    }
    this._saveData(data);
    this._updateBadge();
  },

  markAllRead: function() {
    var data = this._getData();
    for (var i = 0; i < data.length; i++) { data[i].read = true; }
    this._saveData(data);
    this._updateBadge();
  },

  clear: function() {
    this._saveData([]);
    this._updateBadge();
  },

  notify: function(type, message, icon, link) {
    return this.add({ type: type, message: message, icon: icon, link: link });
  },

  _updateBadge: function() {
    var badge = document.getElementById('notifBadge');
    if (!badge) return;
    var count = this.getUnreadCount();
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
};
