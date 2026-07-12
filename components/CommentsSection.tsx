import { supabase } from "@/lib/supabase";
import CommentForm from "./CommentForm";

interface CommentsSectionProps {
  postId: number;
  lang?: "ko" | "en" | "ja";
}

export default async function CommentsSection({ postId, lang = "ko" }: CommentsSectionProps) {
  // Supabase에서 해당 포스트의 승인된 댓글 가져오기
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .eq("is_approved", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments from Supabase:", error);
  }

  const commentList = comments || [];

  const textMap = {
    ko: {
      title: `댓글 (${commentList.length})`,
      noComments: "아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!",
      locale: "ko-KR"
    },
    en: {
      title: `Comments (${commentList.length})`,
      noComments: "No comments yet. Be the first to leave one!",
      locale: "en-US"
    },
    ja: {
      title: `コメント (${commentList.length})`,
      noComments: "まだコメントがありません。最初のコメントを残してみましょう！",
      locale: "ja-JP"
    }
  };

  const currentText = textMap[lang] || textMap.ko;

  return (
    <div className="mt-20 border-t border-gray-100 pt-16">
      <div className="flex items-center gap-3 mb-12">
        <h3 className="text-2xl font-bold text-gray-900">{currentText.title}</h3>
        <div className="h-px flex-grow bg-gray-100" />
      </div>

      {commentList.length > 0 ? (
        <ul className="space-y-10 mb-16">
          {commentList.map((comment) => {
            const date = new Date(comment.created_at).toLocaleString(currentText.locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Seoul",
            });

            return (
              <li key={comment.id} className="group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-magenta-light flex items-center justify-center text-magenta font-bold text-lg border-2 border-white shadow-sm">
                      {comment.author_name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{comment.author_name}</h4>
                      <span className="text-xs text-gray-400 font-medium">{date}</span>
                    </div>
                    <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                      {comment.content}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-12 px-8 rounded-3xl bg-gray-50 text-center mb-16">
          <p className="text-gray-500 font-medium italic">{currentText.noComments}</p>
        </div>
      )}

      {/* Comment Submission Form */}
      <CommentForm postId={postId} lang={lang} />
    </div>
  );
}
