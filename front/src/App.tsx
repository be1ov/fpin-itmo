import AuthPage from "./pages/AuthPage.tsx";
import {ConfigProvider, Layout, notification, Spin, theme} from "antd";
import {useEffect, useMemo} from "react";
import {useSelector} from "react-redux";
import SchedulePage from "./pages/SchedulePage.tsx";
import {Route, BrowserRouter, Routes, useLocation} from "react-router-dom";
import {selectTheme} from "./redux/slices/ThemeSlice.ts";
import {fetchCurrentUser} from "./actions/AuthAction.ts";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {selectAuth} from "./redux/slices/AuthSlice.ts";
import HomePage from "./pages/HomePage.tsx";
import {fetchEducationData} from "./actions/EducationAction.ts";
import UnapprovedPage from "./pages/UnapprovedPage.tsx";
import {AssignmentsPage} from "./pages/AssignmentsPage.tsx";
import {AssignmentPage} from "./pages/AssignmentPage.tsx";
import {StaffPage} from "./pages/staff/StaffPage.tsx";
import {TasksPage} from "./pages/staff/TasksPage.tsx";
import {TaskPage} from "./pages/staff/TaskPage.tsx";
import {SubmissionPage} from "./pages/staff/SubmissionPage.tsx";
import PointsPage from "./pages/PointsPage.tsx";
import TestsPage from "./pages/TestsPage.tsx";
import {TestPage} from "./pages/TestPage.tsx";
import {GithubAuthPage} from "./pages/api/GithubAuthPage.tsx";
import {GithubLinkPage} from "./pages/api/GithubLinkPage.tsx";

function App() {
    console.log("App is rendered")
    const auth = useSelector(selectAuth);
    const enabledTheme = useSelector(selectTheme).mode;

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (!auth.user) {
            return
        }
        fetchEducationData();
    }, [auth.user]);

    const themeConfig = useMemo(() => {
        return {
            algorithm:
                enabledTheme === "dark"
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
        };
    }, [enabledTheme]);

    if (auth.user && !auth.user.is_approved) {
        return (
            <ConfigProvider theme={themeConfig}>
                <UnapprovedPage/>
            </ConfigProvider>
        );
    }

    if (auth.status == "loading") {
        return <ConfigProvider theme={themeConfig}>
            <Layout style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Spin/>
            </Layout>
        </ConfigProvider>;
    }

    return (
        <ConfigProvider theme={themeConfig}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<ProtectedRoute children={<HomePage/>}/>}
                    />
                    <Route
                        path="/schedule"
                        element={<ProtectedRoute children={<SchedulePage/>}/>}
                    />
                    <Route
                        path="/points"
                        element={<ProtectedRoute children={<PointsPage/>}/>}
                    />
                    <Route
                        path="/assignments"
                        element={<ProtectedRoute children={<AssignmentsPage/>}/>}
                    />
                    <Route
                        path="/assignment/:id"
                        element={
                            <ProtectedRoute children={<AssignmentPage/>}/>
                        }
                    />
                    <Route
                        path="/staff/tasks"
                        element={
                            <ProtectedRoute children={<TasksPage/>}/>
                        }
                    />
                    <Route
                        path="/staff/tasks/:id"
                        element={
                            <ProtectedRoute children={<TaskPage/>}/>
                        }
                    />
                    <Route
                        path="/submission/:id"
                        element={
                            <ProtectedRoute children={<SubmissionPage/>}/>
                        }
                    />
                    <Route
                        path="/staff/:section?"
                        element={
                            <ProtectedRoute children={<StaffPage/>}/>
                        }
                    />
                    <Route
                        path="/tests"
                        element={
                            <ProtectedRoute children={<TestsPage/>}/>
                        }
                    />
                    <Route
                        path="/test-assignment/:id"
                        element={
                            <ProtectedRoute children={<TestPage/>}/>
                        }
                    />
                    <Route
                        path="/test-assignment/:id"
                        element={
                            <ProtectedRoute children={<TestPage/>}/>
                        }
                    />
                    <Route
                        path="/github/link" element={<ProtectedRoute children={<GithubLinkPage/>}/>}/>
                    <Route path="/auth/github" element={<GithubAuthPage/>}/>
                    <Route path="/auth" element={<AuthPage/>}/>
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
