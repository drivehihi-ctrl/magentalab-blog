import { getComments, WPComment } from "@/lib/wp";
import CommentForm from "./CommentForm";

interface CommentsSectionProps {
  postId: number;
}

export default async function CommentsSection({ postId }: CommentsSectionProps) {
  const comments = await getComments(postId);

  return (
    <div className="mt-20 border-t border-gray-100 pt-16">
      <div className="flex items-center gap-3 mb-12">
        <h3 className="text-2xl font-bold text-gray-900">댓글 ({comments.length})</h3>
        <div className="h-px flex-grow bg-gray-100" />
      </div>

      {comments.length > 0 ? (
        <ul className="space-y-10 mb-16">
          {comments.map((comment: WPComment) => {
            const date = new Date(comment.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
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
                    <div 
                      className="text-gray-600 leading-relaxed wp-content text-sm"
                      dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-12 px-8 rounded-3xl bg-gray-50 text-center mb-16">
          <p className="text-gray-500 font-medium italic">아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
        </div>
      )}

      {/* Comment Submission Form */}
      <CommentForm postId={postId} />
    </div>
  );
}
