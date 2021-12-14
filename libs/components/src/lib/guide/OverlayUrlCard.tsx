import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Input, Paper, Typography, Button } from '@material-ui/core';
import { UserProfileRes } from '@project-lc/shared-types';
import { useToast } from '@chakra-ui/react';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginRight: theme.spacing(1),
    fontWeight: 'bold',
    fontSize: theme.typography.body2.fontSize,
  },
  textField: {
    maxWidth: 300,
    marginRight: theme.spacing(2),
    fontSize: theme.typography.body2.fontSize,
  },
  line: { alignItems: 'center' },
}));

interface UrlCardProps {
  profileData: UserProfileRes;
}

export function UrlCard({ profileData }: UrlCardProps): JSX.Element {
  const toast = useToast();
  const classes = useStyles();

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_OVERLAY_URL = '[URL복사] 버튼을 눌러주세요.';
  const [overlayUrlValue, setOverlayUrlValue] = useState<string>(DEFAULT_OVERLAY_URL);

  // 10초간 overlayUrl을 보여주는 함수
  const handleShowOverlayUrl = (): void => {
    const overlayUrl = `https://live.크크쇼.com${profileData.overlayUrl}` || '';
    setOverlayUrlValue(overlayUrl);

    // 클립보드 복사
    navigator.clipboard.writeText(overlayUrl);

    toast({ title: '복사되었습니다.', status: 'success' });

    setTimeout(() => {
      setOverlayUrlValue(DEFAULT_OVERLAY_URL);
    }, 8 * 1000);
  };

  return (
    <Paper className={classes.container}>
      <Typography className={classes.title}>라이브 쇼핑 화면 URL</Typography>
      <Input
        className={classes.textField}
        id="overlayUrl"
        value={profileData.agreementFlag ? overlayUrlValue : '이용 동의가 필요합니다.'}
        readOnly
        fullWidth
        disabled={!overlayUrlValue}
      />

      <div>
        <Button
          color="primary"
          variant="contained"
          disabled={!profileData.agreementFlag}
          onClick={(): void => {
            if (!(profileData.overlayUrl === overlayUrlValue)) {
              handleShowOverlayUrl();
            }
          }}
        >
          URL복사
        </Button>
      </div>
    </Paper>
  );
}
