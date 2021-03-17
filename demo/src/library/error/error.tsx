import { Typography } from 'antd';
import './error.scss';

const error = ({ statusCode, message, errors }: any) => {
    const { Paragraph } = Typography;
    return (
        <div className="error">
            <Typography>
                <Paragraph>
                    <ul>
                        {errors && Array.isArray(errors)
                            ? errors.map((error) => {
                                  return <li>{error.errorMessage}</li>;
                              })
                            : null}
                    </ul>
                </Paragraph>
            </Typography>
        </div>
    );
};

export { error as Error };
