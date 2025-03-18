import { NextResponse } from 'next/server';
import { supabase } from '../lib/supabase';

// 获取所有提示词 List
export async function GET(request) {
  try {
    // 从 URL 获取分页参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    // 计算偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 获取总记录数
    const { count } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    // 获取分页数据
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // 返回分页数据和分页信息
    return NextResponse.json({
      data,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取提示词失败' },
      { status: 500 }
    );
  }
}

// 创建新提示词 Create
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, tags } = body;

    // 验证必填字段
    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容为必填项' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          title,
          content,
          tags,
          user_id: 'system', // 这里应该使用实际的用户ID
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '创建提示词失败' },
      { status: 500 }
    );
  }
}