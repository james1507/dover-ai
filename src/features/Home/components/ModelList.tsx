import OurModelList from "@features/Home/components/OurModelList";
import PopularModelList from "@features/Home/components/PopularModelList";

const ModelList = () => {
    return (
        <div>
            <OurModelList />
            <PopularModelList headerModel="Model phổ biến" />
            <PopularModelList headerModel="Model được nhà cung cấp thêm" />
            <PopularModelList headerModel="Model mới gần đây" />
        </div>
    );
};

export default ModelList;
