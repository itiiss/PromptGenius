import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 获取单个提示词 Retrive
export async function GET(request, { params }) {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: '提示词不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '获取提示词失败' },
      { status: 500 }
    );
  }
}

// 更新提示词 Update
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const { title, content, tags } = body;

    const { data, error } = await supabase
      .from('prompts')
      .update({
        title,
        content,
        tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '更新提示词失败' },
      { status: 500 }
    );
  }
}

// 删除提示词
export async function DELETE(request, { params }) {
  try {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json(
      { message: '提示词删除成功' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '删除提示词失败' },
      { status: 500 }
    );
  }
} 