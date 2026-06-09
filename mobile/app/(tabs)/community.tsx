import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl,
  TextInput, Modal, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { tapHaptic, successHaptic } from '../../lib/haptics';
import { colors, spacing } from '../../lib/theme';

type FeedPost = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  photos: string[];
  route_slug: string | null;
  destination_slug: string | null;
  miles: number | null;
  rating: number | null;
  bike: string | null;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: { display_name: string; avatar_url: string | null } | null;
};

type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { display_name: string; avatar_url: string | null } | null;
};

export default function CommunityScreen() {
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // New post state
  const [showNewPost, setShowNewPost] = useState(false);
  const [postBody, setPostBody] = useState('');
  const [postType, setPostType] = useState<string>('ride-report');
  const [postMiles, setPostMiles] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [posting, setPosting] = useState(false);
  const [postPhotos, setPostPhotos] = useState<string[]>([]);

  // Comments state
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  const fetchFeed = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);

    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles!inner(display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      setFeed(data);

      // Fetch liked status
      if (u) {
        const postIds = data.map((p: FeedPost) => p.id);
        const { data: likes } = await supabase
          .from('community_likes')
          .select('post_id')
          .eq('user_id', u.id)
          .in('post_id', postIds);
        const map: Record<string, boolean> = {};
        (likes || []).forEach((l: any) => { map[l.post_id] = true; });
        setLikedPosts(map);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  }, [fetchFeed]);

  const toggleLike = async (postId: string) => {
    if (!user) { Alert.alert('Sign In', 'Sign in to like posts.'); return; }
    tapHaptic();

    const isLiked = likedPosts[postId];
    // Optimistic update
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setFeed((prev) => prev.map((p) =>
      p.id === postId ? { ...p, likes_count: p.likes_count + (isLiked ? -1 : 1) } : p
    ));

    if (isLiked) {
      await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('community_likes').insert({ post_id: postId, user_id: user.id });
    }
  };

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 4,
    });
    if (!result.canceled) {
      setPostPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 4));
    }
  };

  const uploadPhotos = async (photos: string[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const uri of photos) {
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const { error } = await supabase.storage.from('community-photos').upload(fileName, blob, { contentType: 'image/jpeg' });
      if (!error) {
        const { data } = supabase.storage.from('community-photos').getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  };

  const createPost = async () => {
    if (!user) { Alert.alert('Sign In', 'Sign in to post.'); return; }
    if (!postBody.trim() && postPhotos.length === 0) { Alert.alert('Write something', 'Add text or photos.'); return; }

    setPosting(true);
    let photoUrls: string[] = [];
    if (postPhotos.length > 0) {
      photoUrls = await uploadPhotos(postPhotos);
    }

    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      type: postType,
      title: '',
      body: postBody.trim(),
      photos: photoUrls,
      route_slug: null,
      destination_slug: postLocation.trim() || null,
      miles: postMiles ? parseInt(postMiles, 10) : null,
      rating: null,
      bike: '',
      tags: [],
    });

    setPosting(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      successHaptic();
      setShowNewPost(false);
      setPostBody('');
      setPostMiles('');
      setPostLocation('');
      setPostPhotos([]);
      fetchFeed();
    }
  };

  const openComments = async (postId: string) => {
    setShowComments(postId);
    const { data } = await supabase
      .from('community_comments')
      .select('*, profiles!inner(display_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const addComment = async () => {
    if (!user) { Alert.alert('Sign In', 'Sign in to comment.'); return; }
    if (!commentText.trim() || !showComments) return;

    const { data } = await supabase
      .from('community_comments')
      .insert({ post_id: showComments, user_id: user.id, content: commentText.trim() })
      .select('*, profiles!inner(display_name, avatar_url)')
      .single();

    if (data) {
      successHaptic();
      setComments((prev) => [...prev, data]);
      setCommentText('');
      setFeed((prev) => prev.map((p) =>
        p.id === showComments ? { ...p, comments_count: p.comments_count + 1 } : p
      ));
    }
  };

  const fmtTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'ride-report': return 'checkmark-circle';
      case 'photo': return 'camera';
      case 'checkin': return 'location';
      case 'route-share': return 'share-social';
      case 'question': return 'help-circle';
      default: return 'chatbubble';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ride-report': return '#34A853';
      case 'photo': return '#4285F4';
      case 'checkin': return colors.accent;
      case 'route-share': return '#9C27B0';
      case 'question': return '#FF6B35';
      default: return colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {item.profiles?.avatar_url ? (
                <Image source={{ uri: item.profiles.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {(item.profiles?.display_name || 'R').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.headerInfo}>
                <Text style={styles.username}>{item.profiles?.display_name || 'Rider'}</Text>
                <View style={styles.headerMeta}>
                  <Ionicons name={getTypeIcon(item.type)} size={11} color={getTypeColor(item.type)} />
                  {item.destination_slug && (
                    <Text style={styles.location} numberOfLines={1}>{item.destination_slug}</Text>
                  )}
                  <Text style={styles.time}>{fmtTime(item.created_at)}</Text>
                </View>
              </View>
            </View>

            {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
            <Text style={styles.content}>{item.body}</Text>

            {(item.miles || item.bike) && (
              <View style={styles.rideMeta}>
                {item.miles ? (
                  <View style={styles.rideMetaItem}>
                    <Ionicons name="speedometer-outline" size={12} color={colors.accent} />
                    <Text style={styles.rideMetaText}>{item.miles} mi</Text>
                  </View>
                ) : null}
                {item.bike ? (
                  <View style={styles.rideMetaItem}>
                    <Ionicons name="bicycle-outline" size={12} color={colors.accent} />
                    <Text style={styles.rideMetaText}>{item.bike}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {item.photos && item.photos.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
                {item.photos.map((url, i) => (
                  <Image key={i} source={{ uri: url }} style={styles.photo} />
                ))}
              </ScrollView>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(item.id)}>
                <Ionicons
                  name={likedPosts[item.id] ? 'heart' : 'heart-outline'}
                  size={18}
                  color={likedPosts[item.id] ? '#EA4335' : colors.textMuted}
                />
                <Text style={[styles.actionCount, likedPosts[item.id] && { color: '#EA4335' }]}>
                  {item.likes_count}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => openComments(item.id)}>
                <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
                <Text style={styles.actionCount}>{item.comments_count}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptyText}>Be the first to share a ride!</Text>
            </View>
          ) : null
        }
      />

      {/* FAB - New Post */}
      {user && (
        <TouchableOpacity style={styles.fab} onPress={() => { tapHaptic(); setShowNewPost(true); }}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      )}

      {/* New Post Modal */}
      <Modal visible={showNewPost} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView style={styles.modal} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewPost(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Post</Text>
            <TouchableOpacity onPress={createPost} disabled={posting}>
              <Text style={[styles.modalPost, posting && { opacity: 0.5 }]}>
                {posting ? '...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Post type selector */}
            <View style={styles.typeRow}>
              {[
                { id: 'ride-report', label: 'Ride', icon: 'checkmark-circle' },
                { id: 'checkin', label: 'Check-in', icon: 'location' },
                { id: 'photo', label: 'Photo', icon: 'camera' },
                { id: 'question', label: 'Question', icon: 'help-circle' },
              ].map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typePill, postType === t.id && styles.typePillActive]}
                  onPress={() => { tapHaptic(); setPostType(t.id); }}
                >
                  <Ionicons name={t.icon as any} size={14} color={postType === t.id ? '#fff' : colors.textMuted} />
                  <Text style={[styles.typeLabel, postType === t.id && styles.typeLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.postInput}
              placeholder="What's on your mind, rider?"
              placeholderTextColor={colors.textMuted}
              value={postBody}
              onChangeText={setPostBody}
              multiline
              textAlignVertical="top"
            />

            {/* Photo picker */}
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.addPhotoBtn} onPress={pickPhotos}>
                <Ionicons name="camera-outline" size={20} color={colors.accent} />
                <Text style={styles.addPhotoText}>Add Photos ({postPhotos.length}/4)</Text>
              </TouchableOpacity>
              {postPhotos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoPreviewRow}>
                  {postPhotos.map((uri, i) => (
                    <View key={i} style={styles.photoPreview}>
                      <Image source={{ uri }} style={styles.photoPreviewImg} />
                      <TouchableOpacity
                        style={styles.photoRemoveBtn}
                        onPress={() => setPostPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <Ionicons name="close-circle" size={20} color="#EA4335" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {(postType === 'ride-report' || postType === 'checkin') && (
              <View style={styles.extraFields}>
                <TextInput
                  style={styles.extraInput}
                  placeholder="Location (optional)"
                  placeholderTextColor={colors.textMuted}
                  value={postLocation}
                  onChangeText={setPostLocation}
                />
                {postType === 'ride-report' && (
                  <TextInput
                    style={styles.extraInput}
                    placeholder="Miles ridden (optional)"
                    placeholderTextColor={colors.textMuted}
                    value={postMiles}
                    onChangeText={setPostMiles}
                    keyboardType="numeric"
                  />
                )}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Comments Modal */}
      <Modal visible={!!showComments} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView style={styles.modal} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setShowComments(null); setComments([]); }}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comments</Text>
            <View style={{ width: 50 }} />
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.md }}
            renderItem={({ item }) => (
              <View style={styles.commentCard}>
                <Text style={styles.commentUser}>{item.profiles?.display_name || 'Rider'}</Text>
                <Text style={styles.commentBody}>{item.content}</Text>
                <Text style={styles.commentTime}>{fmtTime(item.created_at)}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noComments}>No comments yet</Text>
            }
          />

          {user && (
            <View style={styles.commentInput}>
              <TextInput
                style={styles.commentTextInput}
                placeholder="Write a comment..."
                placeholderTextColor={colors.textMuted}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity onPress={addComment}>
                <Ionicons name="send" size={20} color={colors.accent} />
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: 80 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: { color: colors.accent, fontSize: 14, fontWeight: '800' },
  headerInfo: { flex: 1 },
  username: { color: colors.text, fontSize: 14, fontWeight: '700' },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  location: { color: colors.textMuted, fontSize: 11, flex: 1 },
  time: { color: colors.textMuted, fontSize: 11 },
  title: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 8 },
  content: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: 8 },
  rideMeta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  rideMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rideMetaText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  photoRow: { marginTop: 10 },
  photo: { width: 200, height: 140, borderRadius: 8, marginRight: 8 },
  actions: { flexDirection: 'row', gap: spacing.lg, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionCount: { color: colors.textMuted, fontSize: 12 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: 4 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({ ios: {
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6,
    }}),
  },

  // Modal
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCancel: { color: colors.textMuted, fontSize: 15 },
  modalTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  modalPost: { color: colors.accent, fontSize: 15, fontWeight: '700' },
  modalBody: { flex: 1, padding: spacing.md },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  typeLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  typeLabelActive: { color: '#fff' },
  postInput: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  extraFields: { marginTop: spacing.md, gap: spacing.sm },
  extraInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
  },

  // Photo picker in modal
  photoSection: { marginTop: spacing.md },
  addPhotoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  addPhotoText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  photoPreviewRow: { marginTop: 10 },
  photoPreview: { marginRight: 8, position: 'relative' },
  photoPreviewImg: { width: 80, height: 80, borderRadius: 8 },
  photoRemoveBtn: { position: 'absolute', top: -6, right: -6 },

  // Comments
  commentCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  commentUser: { color: colors.text, fontSize: 13, fontWeight: '700' },
  commentBody: { color: colors.text, fontSize: 14, marginTop: 2 },
  commentTime: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  noComments: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 40 },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 32 : spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: colors.text,
    fontSize: 14,
  },
});
