// 로그인
async function login(email, password){
    return await sb.auth.signInWithPassword({
        email,
        password
    });
}

// 비밀번호 재설정 이메일 요청
async function requestPasswordReset(email, redirectTo){
    return await sb.auth.resetPasswordForEmail(email, {
        redirectTo
    });
}

// 복구 세션에서 새 비밀번호 저장
async function updatePassword(newPassword){
    return await sb.auth.updateUser({
        password: newPassword
    });
}

// 로그아웃
async function logout(){
    return await sb.auth.signOut();
}

// 현재 세션 조회
async function getSession(){
    return await sb.auth.getSession();
}

// 현재 로그인한 사용자 조회
async function getCurrentUser(){
    return await sb.auth.getUser();
}

// 프로필 조회
async function getProfile(userId){
    return await sb
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
}

// 관리자 승인 여부 조회
async function getAdminApproval(userId){
    return await sb
        .from("is_admin")
        .select("isadmin")
        .eq("id", userId)
        .maybeSingle();
}

//비로그인 상태에서 로그인 페이지로
async function requireLogin(){
    const { data:{ session } } = await getSession();
    if(!session){
        location.replace("index.html");
        return null;
    }
    return session.user;
}

//일반회원 전용 페이지
async function requireUser(){
    const user = await requireLogin();
    if(!user) return null;
    const { data:profile } = await getProfile(user.id);
    if(profile.role!=="user"){
        location.replace("index.html");
        return null;
    }
    return {
        user,
        profile
    };

}

//승인된 관리자인지
async function requireAdmin(){
    const user = await requireLogin();
    if(!user) return null;
    const { data:profile } = await getProfile(user.id);
    if(profile.role!=="admin"){
        location.replace("index.html");
        return null;
    }
    const { data:admin } = await getAdminApproval(user.id);
    if(!admin?.isadmin){
        await logout();
        location.replace("index.html");
        return null;
    }
    return {
        user,
        profile,
        admin
    };
}