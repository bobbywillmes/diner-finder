class BusinessSerializer < ActiveModel::Serializer
  attributes :id, :name, :test, :images

  def url
    if object.image.attached?
      {
        url: rails_blob_url(object.image)
      }
    end
  end

  def images
    @images = Image.where(business_id: object.id)
    return @images
  end

end
