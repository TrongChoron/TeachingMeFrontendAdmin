import { CareDown, CareUp, FacebookLogo, ListFill, More, Twitter, Write } from '@icons/index';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import avatarDefault from '@images/userDefault.png';
import userApi from '@api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import ActionModal from './ActionModal';
import postApi from '@api/postApi';
import { toast } from 'react-toastify';

interface iNavLeftProps extends React.HTMLProps<HTMLDivElement> {
    idPost: string;
    owner: {
        avatarLink: string | null;
        id: string;
        username: string;
    };
    like: number;
    isFollow: boolean;
    status: 'Approve' | 'Waiting';
    voteData?: 'Upvote' | 'DownVote';
    isOwner: boolean;
}

const NavLeft: React.FC<iNavLeftProps> = (props) => {
    const { className, idPost, owner, like, isFollow, status, voteData, isOwner } = props;
    const [isFollowState, setIsFollowState] = useState<boolean>(isFollow || false);
    const [disabledNotSpam, setDisableNotSpam] = useState(false);

    const [voteDataState, setVoteDataState] = useState<'Upvote' | 'DownVote' | null>(null);
    const [likeState, setLikeState] = useState(like);
    useEffect(() => {
        if (voteData === undefined) setVoteDataState(null);
        else setVoteDataState(voteData);
        setLikeState(like);
    }, [voteData, like]);
    const [isDisable, setDisable] = useState<boolean>(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const refDivActionModal = useRef<HTMLDivElement>(null);

    // console.log(isFollow);

    useEffect(() => {
        const handleClickOutActionModal = (event: any) => {
            // const buttonShowUser = document.getElementById("showUser");
            // console.log(buttonShowUser);

            if (refDivActionModal.current && !refDivActionModal.current.contains(event.target)) {
                setShowActionModal(false);
            } else {
            }
        };
        document.addEventListener('click', handleClickOutActionModal, true);
        return () => {
            document.removeEventListener('click', handleClickOutActionModal, true);
        };
    }, [refDivActionModal]);

    const { userInfo } = useSelector((state: RootState) => state.users);
    return (
        <div className={' ' + ' ' + className}>
            <div className='visible flex flex-col  items-center pl-[50%] '>
                {isOwner ? (
                    <div className='p-1 mb-4 relative ' ref={refDivActionModal}>
                        <More
                            className='w-6 h-6 hover:cursor-pointer'
                            data-tip='Ch???nh s???a b??i vi???t'
                            data-for='acctionOfPostNavLeft'
                            onClick={() => setShowActionModal(!showActionModal)}
                        />
                        {/* <ReactTooltip
                            textColor='#FF4401'
                            id='acctionOfPostNavLeft'
                            place='top'
                            effect='solid'
                        /> */}
                        {showActionModal ? <ActionModal idPost={idPost} /> : null}
                    </div>
                ) : null}

                <Link to={isOwner ? `/me` : `/user-detail/${owner.id}`}>
                    <img
                        src={owner.avatarLink ? owner.avatarLink : avatarDefault}
                        alt='avatar'
                        className='h-11 w-11 rounded-full'
                    />
                </Link>
                <div className='flex flex-col items-center my-4'>
                    <button
                        className={'p-1 group   disabled:cursor-not-allowed'}
                        data-for='upVote'
                        data-tip={
                            voteDataState !== null && voteDataState === 'Upvote'
                                ? 'Un vote'
                                : 'Up vote'
                        }
                        disabled={disabledNotSpam}
                        onClick={async () => {
                            if (status === undefined || status !== 'Approve') {
                                toast.error('B??i vi???t ch??a ???????c ph?? duy???t');
                            } else {
                                setDisableNotSpam(true);
                                if (isOwner) {
                                    toast('Kh??ng th??? vote b??i vi???t c???a ch??nh b???n', {
                                        icon: '??????',
                                    });
                                } else {
                                    const result = await postApi.voteUp(idPost);
                                    if (result.status === 201) {
                                        if (voteDataState === null) {
                                            toast.success(`Vote th??nh c??ng`);
                                            setVoteDataState('Upvote');
                                            setLikeState(likeState + 1);
                                        } else if (voteDataState === 'DownVote') {
                                            toast.success(`Vote th??nh c??ng`);
                                            setVoteDataState('Upvote');
                                            setLikeState(likeState + 2);
                                        } else {
                                            toast.error(`UnVote th??nh c??ng`);
                                            setVoteDataState(null);
                                            setLikeState(likeState - 1);
                                        }
                                    } else {
                                        toast.error(
                                            `C?? g?? ???? kh??ng ????ng ${result.data.message} vote up`,
                                        );
                                    }
                                }
                                setTimeout(() => setDisableNotSpam(false), 2500);
                            }
                        }}
                    >
                        <CareUp
                            className={
                                ' transition-colors duration-500 ' +
                                (voteDataState !== null && voteDataState === 'Upvote'
                                    ? ' fill-primary  '
                                    : !disabledNotSpam && '  group-hover:fill-primary ')
                            }
                        />
                        {/* <ReactTooltip
                            textColor='#FF4401'
                            id='upVote'
                            place='right'
                            effect='solid'
                        /> */}
                    </button>

                    <span
                        className={
                            'font-medium CareDown' +
                            (voteDataState !== null && ' font-semibold text-primary')
                        }
                    >
                        {likeState >= 0 ? `+${likeState}` : likeState}
                    </span>

                    <button
                        className={'p-1 group disabled:cursor-not-allowed'}
                        data-tip={
                            voteDataState !== null && voteDataState === 'DownVote'
                                ? 'Un vote'
                                : 'Down vote'
                        }
                        disabled={disabledNotSpam}
                        data-for='downVote'
                        onClick={async () => {
                            if (status === undefined || status !== 'Approve') {
                                toast.error('B??i vi???t ch??a ???????c ph?? duy???t');
                            } else {
                                setDisableNotSpam(true);
                                if (isOwner) {
                                    toast('Kh??ng th??? vote b??i vi???t c???a ch??nh b???n', {
                                        icon: '??????',
                                    });
                                } else {
                                    const result = await postApi.voteDown(idPost);
                                    if (result.status === 201) {
                                        if (voteDataState === null) {
                                            toast.success(`Down vote th??nh c??ng`);
                                            setVoteDataState('DownVote');
                                            setLikeState(likeState - 1);
                                        } else if (voteDataState === 'Upvote') {
                                            toast.success(`Down vote th??nh c??ng`);
                                            setVoteDataState('DownVote');
                                            setLikeState(likeState - 2);
                                        } else {
                                            toast.error(`UnVote th??nh c??ng`);
                                            setVoteDataState(null);
                                            setLikeState(likeState + 1);
                                        }
                                    } else {
                                        toast.error(
                                            `C?? g?? ???? kh??ng ????ng ${result.data.message} vote up`,
                                        );
                                    }
                                }
                                setTimeout(() => setDisableNotSpam(false), 2500);
                            }
                        }}
                    >
                        <CareDown
                            className={
                                ' transition-colors duration-500 ' +
                                (voteDataState !== null && voteDataState === 'DownVote'
                                    ? ' fill-primary  '
                                    : !disabledNotSpam && '  group-hover:fill-primary ')
                            }
                        />
                        {/* <ReactTooltip
                            textColor='#FF4401'
                            id='downVote'
                            place='right'
                            effect='solid'
                        /> */}
                    </button>
                </div>
                <button
                    data-tip={isFollowState ? 'Unfollow b??i vi???t n??y' : 'Follow b??i vi???t n??y'}
                    data-for='bookmark'
                    className={
                        'mb-4 mt-2 w-10 h-10 flex flex-col duration-75 justify-center  items-center border-[1px] rounded-full transition-colors   group ' +
                        (!isDisable && ' hover:border-primary 0 ') +
                        (isFollowState ? ' bg-primary border-primary  ' : ' border-bg ') +
                        (isDisable && ' cursor-not-allowed ')
                    }
                    disabled={isDisable}
                    onClick={async () => {
                        setDisable(true);
                        var result;
                        if (isFollowState === true) {
                            // result = await userApi.followPost(idPost);
                        } else {
                            // result = await userApi.followPost(idPost);
                        }
                        // if (result.status === 201) {
                        //     if (isFollowState === true)
                        //         toast.error('Unfollow b??i vi???t th??nh c??ng!');
                        //     else toast.success('Follow b??i vi???t th??nh c??ng!');
                        //     setIsFollowState(!isFollowState);
                        // } else {
                        //     if (result.status === 404) toast.error('B??i vi???t ch??a ???????c ph?? duy???t');
                        // }
                        await setTimeout(() => {
                            setDisable(false);
                        }, 1000);
                    }}
                >
                    <ListFill
                        className={
                            ' duration-75 ' +
                            (isFollowState
                                ? ' fill-white '
                                : !isDisable && '  group-hover:fill-primary  ')
                        }
                    />
                    {/* <ReactTooltip textColor='#FF4401' id='bookmark' place='right' effect='solid' /> */}
                </button>

                <button
                    className='mt-4 mb-2'
                    data-tip='Share b??i vi???t n??y l??n facebook'
                    data-for='facebookShare'
                    onClick={() => {
                        toast('Oops, t??nh n??ng ??ang c???p nh???p', {
                            icon: '??????',
                        });
                    }}
                >
                    <FacebookLogo className='w-5 h-5' />
                    {/* <ReactTooltip
                        textColor='#FF4401'
                        id='facebookShare'
                        place='right'
                        effect='solid'
                    /> */}
                </button>

                <button
                    className='mt-4 '
                    data-tip='Share b??i vi???t n??y l??n Twitter'
                    data-for='twitterShare'
                    onClick={() => {
                        toast('Oops, t??nh n??ng ??ang c???p nh???p', {
                            icon: '??????',
                        });
                    }}
                >
                    <Twitter />
                    {/* <ReactTooltip
                        textColor='#FF4401'
                        id='twitterShare'
                        place='right'
                        effect='solid'
                    /> */}
                </button>
            </div>
        </div>
    );
};

export default NavLeft;
