import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Testimonial } from '../../../../../api/types';
import IconButton from '@mui/material/IconButton';

const Root = styled('div')(({ theme }) => ({
    '& .testimonialImageFeaturedStar': {
        position: 'absolute',
        top: 0,
        right: 0,
        color: orange[400],
        opacity: 0
    },
    '& .testimonialImageUpload': {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut
    },
    '& .testimonialImageItem': {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& .testimonialImageFeaturedStar': {
                opacity: 0.8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& .testimonialImageFeaturedStar': {
                opacity: 1
            },
            '&:hover .testimonialImageFeaturedStar': {
                opacity: 1
            }
        }
    },
    '& .testimonialVideoItem': {
        position: 'relative',
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& .testimonialImageFeaturedStar': {
                opacity: 0.8
            }
        },
        '&.featured': {
            boxShadow: theme.shadows[3],
            '& .testimonialImageFeaturedStar': {
                opacity: 1
            }
        }
    },
    '& .testimonialImageDelete': {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: theme.palette.background.paper,
        padding: 4,
        zIndex: 5,
        boxShadow: theme.shadows[1],
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    }
}));

/**
 * The testimonial images tab.
 */
function TestimonialImagesTab() {
    const methods = useFormContext();
    const { control, watch, setValue, getValues } = methods;

    const images = watch('images') as Testimonial['images'];
    const videos = watch('videos') as Testimonial['videos'];

    return (
        <Root>
            {/* Images section */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Images
            </Typography>
            <div className="-mx-3 flex flex-wrap sm:justify-center sm:justify-start">
                <Controller
                    name="images"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        const imgs = (value || []) as Testimonial['images'];
                        return (
                            <>
                                <Box
                                    sx={(theme) => ({
                                        backgroundColor: lighten(theme.palette.background.default, 0.02),
                                        ...theme.applyStyles('light', {
                                            backgroundColor: lighten(theme.palette.background.default, 0.2)
                                        })
                                    })}
                                    component="label"
                                    htmlFor="button-file"
                                    className="testimonialImageUpload relative mx-3 mb-6 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-sm hover:shadow-lg"
                                >
                                    <input
                                        accept="image/*"
                                        className="hidden"
                                        id="button-file"
                                        type="file"
                                        onChange={async (e) => {
                                            function readFileAsync() {
                                                return new Promise((resolve, reject) => {
                                                    const file = e?.target?.files?.[0];

                                                    if (!file) {
                                                        return;
                                                    }

                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        resolve({
                                                            id: FuseUtils.generateGUID(),
                                                            binary: reader.result, // Binary data
                                                            url: URL.createObjectURL(file), // Generate a URL for the file
                                                            type: 'image',
                                                            name: file.name,
                                                            mimeType: file.type
                                                        });
                                                    };
                                                    reader.onerror = reject;
                                                    reader.readAsArrayBuffer(file);
                                                });
                                            }

                                            const newImage = await readFileAsync();
                                            onChange([newImage, ...(value as Testimonial['images'] || [])]);
                                        }}
                                    />
                                    <FuseSvgIcon size={32} color="action">
                                        lucide:square-arrow-up
                                    </FuseSvgIcon>
                                </Box>

                                {/* Render existing images with delete and featured selection */}
                                {imgs.map((media) => (
                                    media && (
                                        <Box
                                            sx={(theme) => ({
                                                backgroundColor: lighten(theme.palette.background.default, 0.02),
                                                ...theme.applyStyles('light', {
                                                    backgroundColor: lighten(theme.palette.background.default, 0.2)
                                                })
                                            })}
                                            onClick={() => setValue('featuredImageId', media.id)}
                                            onKeyDown={() => setValue('featuredImageId', media.id)}
                                            role="button"
                                            tabIndex={0}
                                            className={clsx(
                                                'testimonialImageItem relative mx-3 mb-6 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-sm outline-hidden hover:shadow-lg',
                                                media.id === getValues('featuredImageId') && 'featured'
                                            )}
                                            key={media.id}
                                        >
                                            <FuseSvgIcon className="testimonialImageFeaturedStar">lucide:star</FuseSvgIcon>

                                            <IconButton
                                                size="small"
                                                className="testimonialImageDelete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const remaining = (getValues('images') || []).filter((m: any) => m.id !== media.id);
                                                    onChange(remaining);
                                                    // Clear featured if deleted
                                                    if (getValues('featuredImageId') === media.id) {
                                                        setValue('featuredImageId', '');
                                                    }
                                                }}
                                                aria-label="delete image"
                                            >
                                                <FuseSvgIcon>lucide:trash-2</FuseSvgIcon>
                                            </IconButton>

                                            <img
                                                className="h-full w-auto max-w-none"
                                                src={media.url}
                                                alt="testimonial"
                                            />
                                        </Box>
                                    )
                                ))}
                            </>
                        );
                    }}
                />
            </div>

            {/* Videos section */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Videos
            </Typography>
            <div className="-mx-3 flex flex-wrap sm:justify-center sm:justify-start">
                <Controller
                    name="videos"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                        const vids = (value || []) as Testimonial['videos'];
                        return (
                            <>
                                <Box
                                    sx={(theme) => ({
                                        backgroundColor: lighten(theme.palette.background.default, 0.02),
                                        ...theme.applyStyles('light', {
                                            backgroundColor: lighten(theme.palette.background.default, 0.2)
                                        })
                                    })}
                                    component="label"
                                    htmlFor="button-file-video"
                                    className="testimonialImageUpload relative mx-3 mb-6 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-sm hover:shadow-lg"
                                >
                                    <input
                                        accept="video/*"
                                        className="hidden"
                                        id="button-file-video"
                                        type="file"
                                        onChange={async (e) => {
                                            function readFileAsync() {
                                                return new Promise((resolve, reject) => {
                                                    const file = e?.target?.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        resolve({
                                                            id: FuseUtils.generateGUID(),
                                                            binary: reader.result,
                                                            url: URL.createObjectURL(file),
                                                            type: 'video',
                                                            name: file.name,
                                                            mimeType: file.type
                                                        });
                                                    };
                                                    reader.onerror = reject;
                                                    reader.readAsArrayBuffer(file);
                                                });
                                            }

                                            const newVideo = await readFileAsync();
                                            onChange([newVideo, ...(value as Testimonial['videos'] || [])]);
                                        }}
                                    />
                                    <FuseSvgIcon size={32} color="action">
                                        lucide:video
                                    </FuseSvgIcon>
                                </Box>

                                {/* Render existing videos with delete and featured selection */}
                                {vids.map((media: any) => (
                                    media && (
                                        <Box
                                            key={media.id}
                                            sx={{ width: 200, mx: 1, mb: 3 }}
                                            onClick={() => setValue('featuredVideoId', media.id)}
                                            onKeyDown={() => setValue('featuredVideoId', media.id)}
                                            role="button"
                                            tabIndex={0}
                                            className={clsx('testimonialVideoItem', media.id === getValues('featuredVideoId') && 'featured')}
                                        >
                                            <FuseSvgIcon className="testimonialImageFeaturedStar">lucide:star</FuseSvgIcon>

                                            <IconButton
                                                size="small"
                                                className="testimonialImageDelete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const remaining = (getValues('videos') || []).filter((m: any) => m.id !== media.id);
                                                    onChange(remaining);
                                                    if (getValues('featuredVideoId') === media.id) {
                                                        setValue('featuredVideoId', '');
                                                    }
                                                }}
                                                aria-label="delete video"
                                            >
                                                <FuseSvgIcon>lucide:trash-2</FuseSvgIcon>
                                            </IconButton>

                                            <video controls width="200" src={media.url} />
                                        </Box>
                                    )
                                ))}
                            </>
                        );
                    }}
                />
            </div>
        </Root>
    );
}

export default TestimonialImagesTab;
